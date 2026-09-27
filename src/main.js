const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const dataFile = () => path.join(app.getPath('userData'), 'care-data.json');
const vaultDir = () => path.join(app.getPath('userData'), 'DocumentVault');

function readData() {
  try { return JSON.parse(fs.readFileSync(dataFile(), 'utf8')); }
  catch { return { people: [], appointments: [], reminders: [], documents: [] }; }
}
function writeData(data) {
  fs.writeFileSync(dataFile(), JSON.stringify(data, null, 2), 'utf8');
  return data;
}
function safeName(name) { return name.replace(/[^a-zA-Z0-9._ -]/g, '_'); }
function importDocument() {
  const result = dialog.showOpenDialogSync({
    title: 'Scan or Import Document into CARE',
    properties: ['openFile'],
    filters: [
      { name: 'Documents and Images', extensions: ['pdf','png','jpg','jpeg','tif','tiff','bmp','webp'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  if (!result?.[0]) return null;
  fs.mkdirSync(vaultDir(), { recursive: true });
  const source = result[0];
  const fileName = `${Date.now()}-${safeName(path.basename(source))}`;
  const destination = path.join(vaultDir(), fileName);
  fs.copyFileSync(source, destination);
  return { fileName, originalName: path.basename(source), path: destination };
}
function createWindow() {
  const win = new BrowserWindow({ width:1280,height:820,minWidth:980,minHeight:650,title:'CARE',webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false} });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}
app.whenReady().then(() => {
  ipcMain.handle('care:load', () => readData());
  ipcMain.handle('care:save', (_event, data) => writeData(data));
  ipcMain.handle('care:import-document', () => importDocument());
  ipcMain.handle('care:open-document', (_event, filePath) => shell.openPath(filePath));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
