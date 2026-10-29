const { app, BrowserWindow, ipcMain, dialog, Menu, Tray, Notification, nativeImage, protocol, session } = require('electron');
const { randomBytes, scryptSync, createCipheriv, createDecipheriv, timingSafeEqual } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// Every earlier release kept the vault in this folder. Pin it so renaming the package
// or running from source (`npm start`) can never point CARE at a different, empty vault.
// `--user-data-dir=<folder>` still selects a separate folder, e.g. for testing.
app.setPath('userData', app.commandLine.getSwitchValue('user-data-dir') || path.join(app.getPath('appData'), 'care-caregiver-organizer'));
// Attachments are shown in a viewer window from memory through this scheme, never from a temp file.
protocol.registerSchemesAsPrivileged([{ scheme: 'care-file', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);

let win, tray = null, quitting = false, vault = null, keyring = null, updater = null;
let updateState = { state: 'unconfigured' };
const startHidden = process.argv.includes('--hidden');
const primaryInstance = app.requestSingleInstanceLock();
if (!primaryInstance) app.quit();
else app.on('second-instance', () => showWindow());

const userFile = name => path.join(app.getPath('userData'), name);
const vaultPath = () => userFile('care-vault.json');
const filesDir = () => userFile('files');
const settingsPath = () => userFile('settings.json');
const remindersPath = () => userFile('reminders.json');
const iconPath = path.join(__dirname, 'assets', process.platform === 'win32' ? 'care-icon.ico' : 'care-icon.png');
const clone = value => JSON.parse(JSON.stringify(value));
const localDay = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const DAY = 864e5, HOUR = 36e5;

function writeAtomic(target, data) {
  const tmp = target + '.tmp';
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(tmp, data, { mode: 0o600 });
  fs.renameSync(tmp, target);
}
// The password is stretched with scrypt once per unlock; while unlocked CARE keeps only the
// derived key (the "keyring"), never the password. Each save uses a fresh random nonce.
// Vaults written before 0.8.0 used N=16384 and no `kdf` field; they are upgraded on unlock.
const KDF = { N: 131072, r: 8, p: 1 };
const LEGACY_KDF = { N: 16384, r: 8, p: 1 };
const deriveKey = (secret, salt, kdf) => scryptSync(secret, salt, 32, { ...kdf, maxmem: 256 * 1024 * 1024 });
function newKeyring(secret) { const salt = randomBytes(32); return { salt, kdf: KDF, key: deriveKey(secret, salt, KDF) }; }
function seal(value, ring) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', ring.key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return { format: 1, kdf: ring.kdf, salt: ring.salt.toString('base64'), iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: encrypted.toString('base64') };
}
function open(record, secret) {
  if (record.format !== 1) throw new Error('Unsupported vault format');
  const kdf = record.kdf || LEGACY_KDF;
  // Bound the parameters so a tampered file can't make unlocking hang or exhaust memory.
  if (![16384, 32768, 65536, 131072, 262144].includes(kdf.N) || kdf.r !== 8 || kdf.p !== 1) throw new Error('Unsupported vault format');
  const ring = { salt: Buffer.from(record.salt, 'base64'), kdf: { N: kdf.N, r: kdf.r, p: kdf.p } };
  ring.key = deriveKey(secret, ring.salt, ring.kdf);
  const decipher = createDecipheriv('aes-256-gcm', ring.key, Buffer.from(record.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(record.tag, 'base64'));
  return { value: JSON.parse(Buffer.concat([decipher.update(Buffer.from(record.ciphertext, 'base64')), decipher.final()]).toString()), ring };
}
const validRecord = r => !!r && r.format === 1 && !!r.ciphertext && !!r.salt && !!r.iv && !!r.tag;
function persist(value) { writeAtomic(vaultPath(), JSON.stringify(seal(value, keyring))); }
function checkSecret(secret) {
  if (typeof secret !== 'string' || secret.length < 12) throw new Error('Use at least 12 characters for the vault password.');
}
function ensureUnlocked() { if (!vault || !keyring) throw new Error('Unlock CARE first.'); }
// The renderer never needs the file key; save() puts it back.
const forRenderer = v => { const c = clone(v); delete c.dataKey; return c; };

// ---- Attachment storage -------------------------------------------------------------
// Each attachment is its own AES-256-GCM file under userData/files, encrypted with a random
// data key kept inside the password-encrypted vault. Saving a record no longer rewrites
// every document, and changing the password doesn't need to touch the files.
const FILE_MAGIC = Buffer.from('CAREF1');
const MAX_DOCUMENT_BYTES = 25_000_000;
const pendingFiles = new Set(); // stored this session but not yet referenced by a saved record
const validFileId = id => typeof id === 'string' && /^[a-f0-9]{32}$/.test(id);
const blobPath = id => { if (!validFileId(id)) throw new Error('Invalid file reference.'); return path.join(filesDir(), id + '.bin'); };
const dataKey = () => Buffer.from(vault.dataKey, 'base64');
function storeFile(bytes) {
  const id = randomBytes(16).toString('hex'), iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', dataKey(), iv);
  const body = Buffer.concat([cipher.update(bytes), cipher.final()]);
  fs.mkdirSync(filesDir(), { recursive: true });
  fs.writeFileSync(blobPath(id), Buffer.concat([FILE_MAGIC, iv, cipher.getAuthTag(), body]), { mode: 0o600 });
  pendingFiles.add(id);
  return id;
}
function readStoredFile(id) {
  let raw;
  try { raw = fs.readFileSync(blobPath(id)); } catch { throw new Error('This file is missing from the CARE vault.'); }
  if (!raw.subarray(0, FILE_MAGIC.length).equals(FILE_MAGIC)) throw new Error('This file is damaged.');
  const decipher = createDecipheriv('aes-256-gcm', dataKey(), raw.subarray(6, 18));
  decipher.setAuthTag(raw.subarray(18, 34));
  return Buffer.concat([decipher.update(raw.subarray(34)), decipher.final()]);
}
const referencedFiles = v => new Set((v.items || []).map(i => i.attachment?.fileId).filter(validFileId));
function cleanupFiles() {
  const keep = referencedFiles(vault);
  let names = [];
  try { names = fs.readdirSync(filesDir()); } catch { return; }
  for (const name of names) {
    const id = name.slice(0, -4);
    if (name.endsWith('.bin') && validFileId(id) && !keep.has(id) && !pendingFiles.has(id)) fs.rmSync(path.join(filesDir(), name), { force: true });
  }
}
// Vaults from 0.7.0 and earlier kept attachments inline as base64; move them to the file store.
function migrate(v) {
  let changed = false;
  if (!v.dataKey) { v.dataKey = randomBytes(32).toString('base64'); changed = true; }
  for (const item of v.items || []) {
    const a = item.attachment;
    if (a && typeof a.content === 'string') {
      const bytes = Buffer.from(a.content, 'base64');
      item.attachment = { name: a.name, fileId: storeFile(bytes), size: bytes.length };
      changed = true;
    }
  }
  return changed;
}

// ---- Backups ------------------------------------------------------------------------
// Format 2: "CAREBAK2", uint32 header length, header JSON {format, vault, files:[{id,size}]},
// then each still-encrypted attachment file. Format 1 backups (a bare vault file) still restore.
const BACKUP_MAGIC = Buffer.from('CAREBAK2');
function writeBackup(target) {
  const record = JSON.parse(fs.readFileSync(vaultPath(), 'utf8'));
  const ids = [...referencedFiles(vault)].filter(id => fs.existsSync(blobPath(id)));
  const files = ids.map(id => ({ id, size: fs.statSync(blobPath(id)).size }));
  const header = Buffer.from(JSON.stringify({ format: 2, vault: record, files }));
  const length = Buffer.alloc(4); length.writeUInt32LE(header.length);
  const tmp = target + '.tmp';
  const fd = fs.openSync(tmp, 'w');
  try {
    for (const part of [BACKUP_MAGIC, length, header]) fs.writeSync(fd, part);
    for (const id of ids) fs.writeSync(fd, fs.readFileSync(blobPath(id)));
  } finally { fs.closeSync(fd); }
  fs.renameSync(tmp, target);
}
function readExactly(fd, size, position) {
  const buf = Buffer.alloc(size);
  let done = 0;
  while (done < size) {
    const got = fs.readSync(fd, buf, done, size - done, position + done);
    if (!got) throw new Error('This backup file is incomplete.');
    done += got;
  }
  return buf;
}
function restoreBackup(source) {
  const fd = fs.openSync(source, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    let record, files = [], offset = 0;
    try {
      if (size >= 12 && readExactly(fd, 8, 0).equals(BACKUP_MAGIC)) {
        const headerLength = readExactly(fd, 4, 8).readUInt32LE(0);
        if (headerLength > size - 12) throw new Error('bad header');
        const header = JSON.parse(readExactly(fd, headerLength, 12).toString());
        record = header.vault; files = Array.isArray(header.files) ? header.files : []; offset = 12 + headerLength;
      } else if (size <= 200_000_000) record = JSON.parse(fs.readFileSync(source, 'utf8'));
    } catch { throw new Error('That file is not a CARE backup.'); }
    if (!validRecord(record) || !files.every(f => validFileId(f.id) && Number.isSafeInteger(f.size) && f.size >= 0)) throw new Error('Invalid CARE backup.');
    // Check the listed sizes against the real file before allocating anything for them.
    if (offset + files.reduce((sum, f) => sum + f.size, 0) > size) throw new Error('This backup file is incomplete.');
    fs.mkdirSync(filesDir(), { recursive: true });
    for (const f of files) { fs.writeFileSync(blobPath(f.id), readExactly(fd, f.size, offset), { mode: 0o600 }); offset += f.size; }
    fs.writeFileSync(vaultPath(), JSON.stringify(record), { flag: 'wx', mode: 0o600 });
  } finally { fs.closeSync(fd); }
}

// ---- Settings (plain JSON: holds no care data) ----------------------------------------
const DEFAULT_SETTINGS = { reminders: true, tray: true, openAtLogin: false, autoBackupDir: null, lastAutoBackup: null, autoBackupError: null, trayHintShown: false };
let settings = { ...DEFAULT_SETTINGS };
function loadSettings() { try { settings = { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(settingsPath(), 'utf8')) }; } catch { settings = { ...DEFAULT_SETTINGS }; } }
function saveSettings() { writeAtomic(settingsPath(), JSON.stringify(settings, null, 2)); }
const publicSettings = () => ({ ...settings, canOpenAtLogin: app.isPackaged && process.platform === 'win32', notificationsSupported: Notification.isSupported() });
function sendToWindow(channel, value) { if (win && !win.isDestroyed()) win.webContents.send(channel, value); }
function applyLoginItem() {
  if (app.isPackaged && process.platform === 'win32') app.setLoginItemSettings({ openAtLogin: !!settings.openAtLogin, args: ['--hidden'] });
}

const AUTO_BACKUP_DAYS = 7, AUTO_BACKUP_KEEP = 5;
function maybeAutoBackup(force = false) {
  const dir = settings.autoBackupDir;
  if (!dir || !vault) return;
  if (!force && settings.lastAutoBackup && Date.now() - Date.parse(settings.lastAutoBackup) < AUTO_BACKUP_DAYS * DAY) return;
  try {
    if (!fs.existsSync(dir)) throw new Error('The backup folder could not be found. If it is on a USB drive, plug it in.');
    writeBackup(path.join(dir, `CARE-auto-backup-${localDay()}.care`));
    const old = fs.readdirSync(dir).filter(n => /^CARE-auto-backup-\d{4}-\d{2}-\d{2}\.care$/.test(n)).sort().reverse().slice(AUTO_BACKUP_KEEP);
    for (const name of old) fs.rmSync(path.join(dir, name), { force: true });
    settings.lastAutoBackup = new Date().toISOString(); settings.autoBackupError = null;
  } catch (err) { settings.autoBackupError = err.message; }
  saveSettings(); sendToWindow('settings', publicSettings());
}

// ---- Reminders ------------------------------------------------------------------------
// The schedule is stored outside the vault so reminders work while CARE is locked. It holds
// only times and generic wording: no names, titles or other care details.
let reminders = { items: [], fired: [] };
const liveNotifications = new Set(); // keeps click handlers alive until the toast is used
function loadReminders() {
  try {
    const r = JSON.parse(fs.readFileSync(remindersPath(), 'utf8'));
    reminders = { items: Array.isArray(r.items) ? r.items : [], fired: Array.isArray(r.fired) ? r.fired : [] };
  } catch { reminders = { items: [], fired: [] }; }
}
function buildReminders(v) {
  const out = [], now = Date.now();
  const at = (day, hour, shiftDays = 0) => { const d = new Date(day + 'T00:00:00'); d.setDate(d.getDate() + shiftDays); d.setHours(hour, 0, 0, 0); return +d; };
  const time = t => new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const longDay = day => new Date(day + 'T12:00:00').toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  const push = (id, fireAt, body) => { if (Number.isFinite(fireAt) && fireAt > now - 12 * HOUR && fireAt < now + 60 * DAY) out.push({ id, fireAt, body }); };
  for (const i of v.items || []) {
    if (typeof i.date !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(i.date)) continue;
    const day = i.date.slice(0, 10), key = `${i.id}|${i.date}`;
    if (i.type === 'appointments') {
      if (i.date.length > 10) {
        const t = Date.parse(i.date);
        push(key + '|day', t - DAY, `You have an appointment tomorrow at ${time(t)}.`);
        push(key + '|hour', t - HOUR, `You have an appointment in 1 hour, at ${time(t)}.`);
      } else {
        push(key + '|day', at(day, 9, -1), 'You have an appointment tomorrow.');
        push(key + '|today', at(day, 8), 'You have an appointment today.');
      }
    } else if (i.type === 'tasks' && !i.done) push(key + '|due', at(day, 9), 'A task is due today.');
    else if (i.type === 'medications' && !i.stopped) {
      push(key + '|soon', at(day, 9, -2), `A medication refill is due ${longDay(day)}.`);
      push(key + '|today', at(day, 9), 'A medication refill is due today.');
    }
  }
  return out;
}
function writeReminders() {
  reminders.items = settings.reminders && vault ? buildReminders(vault) : [];
  const ids = new Set(reminders.items.map(r => r.id));
  reminders.fired = reminders.fired.filter(id => ids.has(id));
  writeAtomic(remindersPath(), JSON.stringify(reminders));
}
function checkReminders() {
  if (!settings.reminders || !Notification.isSupported()) return;
  const now = Date.now();
  let changed = false;
  for (const r of reminders.items) {
    if (r.fireAt > now || reminders.fired.includes(r.id)) continue;
    reminders.fired.push(r.id); changed = true;
    if (now - r.fireAt > 12 * HOUR) continue; // CARE was closed too long; don't pop up stale reminders
    const toast = new Notification({ title: 'CARE reminder', body: `${r.body} Open CARE for details.`, icon: iconPath });
    liveNotifications.add(toast);
    toast.on('click', () => { liveNotifications.delete(toast); showWindow(); });
    toast.on('close', () => liveNotifications.delete(toast));
    toast.show();
  }
  if (changed) writeAtomic(remindersPath(), JSON.stringify(reminders));
}

// ---- Windows, tray and viewer -----------------------------------------------------------
const viewers = new Set(), viewTokens = new Map();
const VIEW_TYPES = { pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', txt: 'text/plain; charset=utf-8', eml: 'text/plain; charset=utf-8', csv: 'text/plain; charset=utf-8' };
const viewType = name => VIEW_TYPES[path.extname(String(name || '')).slice(1).toLowerCase()];
function lockVault(notify = false) {
  keyring?.key.fill(0);
  vault = null; keyring = null; pendingFiles.clear();
  for (const viewer of viewers) viewer.close();
  viewTokens.clear();
  if (notify) sendToWindow('locked');
}
function showWindow() {
  if (!win) return makeWindow(true);
  if (win.isMinimized()) win.restore();
  win.show(); win.focus();
}
function setupTray() {
  if (!settings.tray) { if (tray) { tray.destroy(); tray = null; } return; }
  if (tray) return;
  tray = new Tray(nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 }));
  tray.setToolTip('CARE');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Open CARE', click: showWindow },
    { label: 'Lock CARE', click: () => lockVault(true) },
    { type: 'separator' },
    { label: 'Quit CARE', click: () => { quitting = true; app.quit(); } }
  ]));
  tray.on('click', showWindow);
}
function updateUI(next) {
  updateState = { ...updateState, ...next };
  sendToWindow('update-state', updateState);
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
function makeWindow(show = !(startHidden && settings.tray)) {
  win = new BrowserWindow({ width: 1320, height: 850, minWidth: 900, minHeight: 650, show: false, icon: iconPath,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true } });
  win.removeMenu();
  win.loadFile('desktop.html');
  if (show) win.once('ready-to-show', () => win.show());
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', e => e.preventDefault());
  // The app menu is removed, so offer cut/copy/paste on right-click.
  win.webContents.on('context-menu', (_e, params) => {
    const { isEditable, selectionText, editFlags } = params;
    if (!isEditable && !selectionText) return;
    const items = isEditable
      ? [{ role: 'cut', enabled: editFlags.canCut }, { role: 'copy', enabled: editFlags.canCopy }, { role: 'paste', enabled: editFlags.canPaste }, { type: 'separator' }, { role: 'selectAll' }]
      : [{ role: 'copy' }];
    Menu.buildFromTemplate(items).popup({ window: win });
  });
  // With the tray on, closing the window hides and locks CARE; it keeps running for reminders.
  win.on('close', e => {
    if (quitting || !settings.tray) return;
    e.preventDefault();
    win.hide();
    lockVault(true);
    if (!settings.trayHintShown && Notification.isSupported()) {
      new Notification({ title: 'CARE is still running', body: 'CARE is locked and stays in the system tray so reminders can appear. Right-click the tray icon to quit.', icon: iconPath }).show();
      settings.trayHintShown = true; saveSettings();
    }
  });
  win.on('closed', () => { lockVault(); win = null; });
}
const safeFileName = s => String(s || 'CARE').replace(/[\\/:*?"<>|]+/g, ' ').trim().slice(0, 80) || 'CARE';

app.on('before-quit', () => { quitting = true; });
if (primaryInstance) app.whenReady().then(() => {
  if (process.platform === 'win32') app.setAppUserModelId('com.care.organizer');
  loadSettings(); loadReminders();
  // CARE never needs camera, microphone, location, or other web permissions; refuse them all.
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  protocol.handle('care-file', request => {
    const entry = viewTokens.get(new URL(request.url).pathname.slice(1));
    if (!entry) return new Response('This file is no longer open.', { status: 404 });
    return new Response(entry.bytes, { headers: { 'Content-Type': entry.mime, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' } });
  });
  ipcMain.handle('get-update-state', () => updateState);
  ipcMain.handle('check-updates', async () => { if (!updater) return updateState; try { await updater.checkForUpdates(); } catch { updateUI({ state: 'error' }); } return updateState; });
  ipcMain.handle('install-update', () => { if (updater && updateState.state === 'ready') { quitting = true; updater.quitAndInstall(false, true); return true; } return false; });
  ipcMain.handle('status', () => ({ exists: fs.existsSync(vaultPath()) }));
  ipcMain.handle('create', (_e, secret) => {
    if (fs.existsSync(vaultPath())) throw new Error('A CARE vault already exists.');
    checkSecret(secret);
    const initial = { caregiver: null, profiles: [], items: [], version: 1, dataKey: randomBytes(32).toString('base64') };
    keyring = newKeyring(secret); persist(initial); vault = initial; return forRenderer(vault);
  });
  ipcMain.handle('unlock', (_e, secret) => {
    let opened;
    try { opened = open(JSON.parse(fs.readFileSync(vaultPath(), 'utf8')), secret); }
    catch { lockVault(); throw new Error('Could not unlock. Check the password or vault file.'); }
    vault = opened.value; keyring = opened.ring;
    const weakKdf = keyring.kdf.N < KDF.N;
    if (weakKdf) { keyring.key.fill(0); keyring = newKeyring(secret); }
    if (migrate(vault) || weakKdf) { persist(vault); pendingFiles.clear(); }
    writeReminders(); maybeAutoBackup();
    return forRenderer(vault);
  });
  ipcMain.handle('save', (_e, value) => {
    ensureUnlocked();
    if (!value || !Array.isArray(value.profiles) || !Array.isArray(value.items)) throw new Error('Invalid CARE data.');
    const next = { ...value, dataKey: vault.dataKey };
    if (JSON.stringify(next).length > 100_000_000) throw new Error('Vault data limit reached.');
    persist(next); vault = next;
    for (const id of referencedFiles(vault)) pendingFiles.delete(id);
    cleanupFiles(); writeReminders(); maybeAutoBackup();
    return true;
  });
  ipcMain.handle('change-password', (_e, current, next) => {
    ensureUnlocked();
    if (typeof current !== 'string' || !timingSafeEqual(deriveKey(current, keyring.salt, keyring.kdf), keyring.key)) throw new Error('The current password is not correct.');
    checkSecret(next);
    const previous = keyring;
    keyring = newKeyring(next);
    try { persist(vault); } catch (err) { keyring.key.fill(0); keyring = previous; throw err; }
    previous.key.fill(0);
    return true;
  });
  ipcMain.handle('lock', () => { lockVault(); return true; });
  ipcMain.handle('backup', async () => {
    ensureUnlocked();
    const { canceled, filePath } = await dialog.showSaveDialog(win, { title: 'Save encrypted CARE backup', defaultPath: `CARE-backup-${localDay()}.care`, filters: [{ name: 'CARE encrypted backup', extensions: ['care'] }] });
    if (canceled) return false;
    writeBackup(filePath); return true;
  });
  ipcMain.handle('import-backup', async () => {
    if (fs.existsSync(vaultPath())) throw new Error('Backup import is available only before creating a vault, to protect existing data.');
    const { canceled, filePaths } = await dialog.showOpenDialog(win, { title: 'Choose CARE backup', properties: ['openFile'], filters: [{ name: 'CARE encrypted backup', extensions: ['care'] }] });
    if (canceled) return false;
    restoreBackup(filePaths[0]); return true;
  });
  ipcMain.handle('get-settings', () => publicSettings());
  ipcMain.handle('set-setting', (_e, key, value) => {
    if (!['reminders', 'tray', 'openAtLogin'].includes(key)) throw new Error('Unknown setting.');
    settings[key] = !!value; saveSettings();
    if (key === 'tray') setupTray();
    if (key === 'openAtLogin') applyLoginItem();
    if (key === 'reminders') writeReminders();
    return publicSettings();
  });
  ipcMain.handle('choose-backup-folder', async () => {
    ensureUnlocked();
    const { canceled, filePaths } = await dialog.showOpenDialog(win, { title: 'Choose a folder for automatic backups', properties: ['openDirectory', 'createDirectory'] });
    if (canceled) return publicSettings();
    settings.autoBackupDir = filePaths[0]; settings.lastAutoBackup = null; settings.autoBackupError = null;
    maybeAutoBackup(true); saveSettings(); return publicSettings();
  });
  ipcMain.handle('clear-backup-folder', () => { settings.autoBackupDir = null; settings.autoBackupError = null; saveSettings(); return publicSettings(); });
  ipcMain.handle('auto-backup-now', () => { ensureUnlocked(); maybeAutoBackup(true); return publicSettings(); });
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
    if (stat.size > MAX_DOCUMENT_BYTES) throw new Error('Choose a file smaller than 25 MB.');
    const name = path.basename(filePaths[0]);
    const bytes = fs.readFileSync(filePaths[0]);
    let email = null;
    if (name.toLowerCase().endsWith('.eml')) {
      const header = bytes.toString('utf8', 0, Math.min(bytes.length, 64000)).split(/\r?\n\r?\n/, 1)[0].replace(/\r?\n[ \t]+/g, ' ');
      const field = key => (header.match(new RegExp('^' + key + ':\\s*(.+)$', 'im'))?.[1] || '').trim().slice(0, 300);
      email = { subject: field('Subject'), from: field('From'), date: field('Date') };
    }
    return { name, fileId: storeFile(bytes), size: bytes.length, email };
  });
  ipcMain.handle('save-document', async (_e, name, fileId) => {
    ensureUnlocked();
    const bytes = readStoredFile(fileId);
    const { canceled, filePath } = await dialog.showSaveDialog(win, { defaultPath: path.basename(name || 'document'), title: 'Save document copy' });
    if (canceled) return false;
    // The save dialog already asks before replacing an existing file.
    fs.writeFileSync(filePath, bytes); return true;
  });
  ipcMain.handle('view-document', (_e, name, fileId) => {
    ensureUnlocked();
    const mime = viewType(name);
    if (!mime) throw new Error('CARE can show PDFs, pictures, and text files. Use "Save a copy" to open this file in another program.');
    const token = randomBytes(16).toString('hex');
    viewTokens.set(token, { bytes: readStoredFile(fileId), mime });
    const viewer = new BrowserWindow({ width: 900, height: 1000, title: path.basename(name), icon: iconPath, parent: win,
      webPreferences: { sandbox: true, contextIsolation: true, nodeIntegration: false, plugins: true } });
    viewer.removeMenu();
    viewers.add(viewer);
    viewer.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    viewer.webContents.on('will-navigate', e => e.preventDefault());
    viewer.on('page-title-updated', e => e.preventDefault());
    viewer.on('closed', () => { viewers.delete(viewer); viewTokens.delete(token); });
    viewer.loadURL(`care-file://view/${token}`);
    return true;
  });
  ipcMain.handle('print-sheet', async (_e, mode, name) => {
    ensureUnlocked();
    if (mode === 'print') return new Promise(resolve => win.webContents.print({ printBackground: true }, ok => resolve(ok)));
    const { canceled, filePath } = await dialog.showSaveDialog(win, { title: 'Save emergency sheet as PDF', defaultPath: `${safeFileName(name)} - emergency sheet.pdf`, filters: [{ name: 'PDF document', extensions: ['pdf'] }] });
    if (canceled) return false;
    fs.writeFileSync(filePath, await win.webContents.printToPDF({ pageSize: 'Letter', printBackground: true }));
    return true;
  });
  ipcMain.handle('calendar', async (_e, event) => {
    ensureUnlocked();
    const { canceled, filePath } = await dialog.showSaveDialog(win, { defaultPath: 'CARE-appointment.ics', filters: [{ name: 'Calendar event', extensions: ['ics'] }] });
    if (canceled) return false;
    const esc = s => String(s || '').replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/[,;]/g, '\\$&');
    const stamp = s => new Date(s).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    // RFC 5545 caps lines at 75 bytes; longer lines continue on the next line after a space.
    const fold = line => { let out = '', len = 0; for (const ch of line) { const n = Buffer.byteLength(ch); if (len + n > 74) { out += '\r\n '; len = 1; } out += ch; len += n; } return out; };
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(event.date || '');
    // A date-only value would otherwise parse as UTC midnight and land on the previous day in the Americas.
    const start = new Date(allDay ? event.date + 'T00:00:00' : event.date);
    if (Number.isNaN(+start)) throw new Error('Enter a valid appointment date and time.');
    const day = d => d.toISOString().slice(0, 10).replace(/-/g, '');
    const when = allDay
      ? [`DTSTART;VALUE=DATE:${event.date.replace(/-/g, '')}`, `DTEND;VALUE=DATE:${day(new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate() + 1)))}`]
      : [`DTSTART:${stamp(start)}`, `DTEND:${stamp(new Date(+start + 60 * 60000))}`];
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CARE//Caregiver Organizer//EN','BEGIN:VEVENT',`UID:${randomBytes(16).toString('hex')}@care.local`,`DTSTAMP:${stamp(new Date())}`,...when,`SUMMARY:${esc(event.title)}`,`LOCATION:${esc(event.detail)}`,'END:VEVENT','END:VCALENDAR',''].map(fold).join('\r\n');
    fs.writeFileSync(filePath, ics); return true;
  });
  makeWindow();
  setupTray();
  applyLoginItem();
  setupUpdater();
  setTimeout(checkReminders, 5000);
  setInterval(checkReminders, 30000);
  app.on('activate', showWindow);
});
app.on('window-all-closed', () => { lockVault(); if (process.platform !== 'darwin') app.quit(); });
