const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { randomBytes, scryptSync, createCipheriv, createDecipheriv } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

let win, vault = null, password = null, updater = null;
let updateState = { state: 'unconfigured' };
if (typeof app.requestSingleInstanceLock === 'function' && !app.requestSingleInstanceLock()) app.quit();
else app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
const vaultPath = () => path.join(app.getPath('userData'), 'care-vault.json');
const clone = value => JSON.parse(JSON.stringify(value));
function encrypt(value, secret) {
  const salt = randomBytes(32), iv = randomBytes(12);
  const key = scryptSync(secret, salt, 32, { N: 16384, r: 8, p: 1 });
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return { format: 1, salt: salt.toString('base64'), iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: encrypted.toString('base64') };
}
function decrypt(record, secret) {
  if (record.format !== 1) throw new Error('Unsupported vault format');
  const key = scryptSync(secret, Buffer.from(record.salt, 'base64'), 32, { N: 16384, r: 8, p: 1 });
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(record.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(record.tag, 'base64'));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(record.ciphertext, 'base64')), decipher.final()]).toString());
}
function persist(value, secret) {
  const target = vaultPath(), tmp = target + '.tmp';
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(encrypt(value, secret)), { mode: 0o600 });
  fs.renameSync(tmp, target);
}
function checkSecret(secret) {
  if (typeof secret !== 'string' || secret.length < 12) throw new Error('Use at least 12 characters for the vault password.');
}
function ensureUnlocked() { if (!vault || !password) throw new Error('Unlock CARE first.'); }
function updateUI(next) {
  updateState = { ...updateState, ...next };
  if (win && !win.isDestroyed()) win.webContents.send('update-state', updateState);
}
function setupUpdater() {
  // electron-builder writes app-update.yml only after a release provider is configured.
  if (process.platform !== 'win32' || !app.isPackaged || !fs.existsSync(path.join(process.resourcesPath, 'app-update.yml'))) return;
  try {
    updater = require('electron-updater').autoUpdater;
    updater.autoDownload = true;
    updater.autoInstallOnAppQuit = true;
    updater.on('checking-for-update', () => updateUI({ state: 'checking' }));
    updater.on('update-available', info => updateUI({ state: 'downloading', version: info.version }));
    updater.on('download-progress', info => updateUI({ state: 'downloading', progress: Math.round(info.percent) }));
    updater.on('update-not-available', () => updateUI({ state: 'current', progress: null }));
    updater.on('update-downloaded', info => updateUI({ state: 'ready', version: info.version, progress: 100 }));
    updater.on('error', () => updateUI({ state: 'error', progress: null }));
    updateUI({ state: 'current' });
    setTimeout(() => updater.checkForUpdates().catch(() => updateUI({ state: 'error' })), 15000);
    setInterval(() => updater.checkForUpdates().catch(() => updateUI({ state: 'error' })), 6 * 60 * 60 * 1000).unref();
  } catch { updateUI({ state: 'error' }); }
}
function makeWindow() {
  win = new BrowserWindow({ width: 1320, height: 850, minWidth: 900, minHeight: 650, show: false, icon: path.join(__dirname, 'assets', 'care-icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true } });
  win.removeMenu();
  win.loadFile('desktop.html');
  win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.on('closed', () => { vault = null; password = null; win = null; });
}
app.whenReady().then(() => {
  if (process.platform === 'win32') app.setAppUserModelId('com.care.organizer');
  ipcMain.handle('get-update-state', () => updateState);
  ipcMain.handle('check-updates', async () => { if (!updater) return updateState; try { await updater.checkForUpdates(); } catch { updateUI({ state: 'error' }); } return updateState; });
  ipcMain.handle('install-update', () => { if (updater && updateState.state === 'ready') { updater.quitAndInstall(false, true); return true; } return false; });
  ipcMain.handle('status', () => ({ exists: fs.existsSync(vaultPath()) }));
  ipcMain.handle('create', (_e, secret) => {
    if (fs.existsSync(vaultPath())) throw new Error('A CARE vault already exists.');
    checkSecret(secret);
    const initial = { caregiver: null, profiles: [], items: [], version: 1 };
    persist(initial, secret); vault = initial; password = secret; return clone(vault);
  });
  ipcMain.handle('unlock', (_e, secret) => {
    try { vault = decrypt(JSON.parse(fs.readFileSync(vaultPath(), 'utf8')), secret); password = secret; return clone(vault); }
    catch { vault = null; password = null; throw new Error('Could not unlock. Check the password or vault file.'); }
  });
  ipcMain.handle('save', (_e, value) => {
    ensureUnlocked();
    if (!value || !Array.isArray(value.profiles) || !Array.isArray(value.items)) throw new Error('Invalid CARE data.');
    const serialized = JSON.stringify(value);
    if (serialized.length > 100_000_000) throw new Error('Vault data limit reached.');
    persist(value, password); vault = clone(value); return true;
  });
  ipcMain.handle('lock', () => { vault = null; password = null; return true; });
  ipcMain.handle('backup', async () => {
    ensureUnlocked();
    const { canceled, filePath } = await dialog.showSaveDialog(win, { title: 'Save encrypted CARE backup', defaultPath: 'CARE-backup.care', filters: [{ name: 'CARE encrypted backup', extensions: ['care'] }] });
    if (canceled) return false;
    fs.copyFileSync(vaultPath(), filePath); return true;
  });
  ipcMain.handle('import-backup', async () => {
    if (fs.existsSync(vaultPath())) throw new Error('Backup import is available only before creating a vault, to protect existing data.');
    const { canceled, filePaths } = await dialog.showOpenDialog(win, { title: 'Choose CARE backup', properties: ['openFile'], filters: [{ name: 'CARE encrypted backup', extensions: ['care'] }] });
    if (canceled) return false;
    const raw = fs.readFileSync(filePaths[0]);
    const record = JSON.parse(raw.toString());
    if (record.format !== 1 || !record.ciphertext || !record.salt || !record.iv || !record.tag) throw new Error('Invalid CARE backup.');
    fs.mkdirSync(path.dirname(vaultPath()), { recursive: true }); fs.writeFileSync(vaultPath(), raw, { flag: 'wx', mode: 0o600 }); return true;
  });
  ipcMain.handle('choose-photo', async () => {
    ensureUnlocked();
    const { canceled, filePaths } = await dialog.showOpenDialog(win, { title: 'Choose profile photo', properties: ['openFile'], filters: [{ name: 'Photos', extensions: ['png', 'jpg', 'jpeg', 'webp'] }] });
    if (canceled) return null;
    const bytes = fs.readFileSync(filePaths[0]);
    if (bytes.length > 3_000_000) throw new Error('Choose a photo smaller than 3 MB.');
    const starts = (...values) => values.every((value, i) => bytes[i] === value);
    const mime = starts(0x89,0x50,0x4e,0x47) ? 'image/png' : starts(0xff,0xd8,0xff) ? 'image/jpeg' : bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP' ? 'image/webp' : null;
    if (!mime) throw new Error('Choose a PNG, JPEG, or WebP photo.');
    return `data:${mime};base64,${bytes.toString('base64')}`;
  });
  ipcMain.handle('add-document', async () => {
    ensureUnlocked();
    const { canceled, filePaths } = await dialog.showOpenDialog(win, { title: 'Choose document', properties: ['openFile'] });
    if (canceled) return null;
    const stat = fs.statSync(filePaths[0]);
    if (stat.size > 5_000_000) throw new Error('Document limit is 5 MB per file in this version.');
    const name = path.basename(filePaths[0]);
    const bytes = fs.readFileSync(filePaths[0]);
    let email = null;
    if (name.toLowerCase().endsWith('.eml')) {
      const header = bytes.toString('utf8', 0, Math.min(bytes.length, 64000)).split(/\r?\n\r?\n/, 1)[0].replace(/\r?\n[ \t]+/g, ' ');
      const field = key => (header.match(new RegExp('^' + key + ':\\s*(.+)$', 'im'))?.[1] || '').trim().slice(0, 300);
      email = { subject: field('Subject'), from: field('From'), date: field('Date') };
    }
    return { name, content: bytes.toString('base64'), email };
  });
  ipcMain.handle('save-document', async (_e, name, content) => {
    ensureUnlocked();
    const { canceled, filePath } = await dialog.showSaveDialog(win, { defaultPath: path.basename(name || 'document'), title: 'Save document copy' });
    if (canceled) return false;
    fs.writeFileSync(filePath, Buffer.from(content, 'base64'), { flag: 'wx' }); return true;
  });
  ipcMain.handle('calendar', async (_e, event) => {
    ensureUnlocked();
    const { canceled, filePath } = await dialog.showSaveDialog(win, { defaultPath: 'CARE-appointment.ics', filters: [{ name: 'Calendar event', extensions: ['ics'] }] });
    if (canceled) return false;
    const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, '\\$&');
    const stamp = s => new Date(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const start = new Date(event.date);
    if (Number.isNaN(+start)) throw new Error('Enter a valid appointment date and time.');
    const end = new Date(+start + 60 * 60000);
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CARE//Caregiver Organizer//EN','BEGIN:VEVENT',`UID:${randomBytes(16).toString('hex')}@care.local`,`DTSTAMP:${stamp(new Date())}`,`DTSTART:${stamp(start)}`,`DTEND:${stamp(end)}`,`SUMMARY:${esc(event.title)}`,`LOCATION:${esc(event.detail)}`,'END:VEVENT','END:VCALENDAR',''].join('\r\n');
    fs.writeFileSync(filePath, ics); return true;
  });
  makeWindow();
  setupUpdater();
  app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) makeWindow(); });
});
app.on('window-all-closed', () => { vault = null; password = null; if (process.platform !== 'darwin') app.quit(); });
