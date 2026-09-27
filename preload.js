const { contextBridge, ipcRenderer } = require('electron');
const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args);
contextBridge.exposeInMainWorld('care', Object.freeze({
  getUpdateState: () => invoke('get-update-state'), checkUpdates: () => invoke('check-updates'), installUpdate: () => invoke('install-update'),
  onUpdateState: callback => { const handler = (_event, state) => callback(state); ipcRenderer.on('update-state', handler); return () => ipcRenderer.removeListener('update-state', handler); },
  status: () => invoke('status'), create: password => invoke('create', password), unlock: password => invoke('unlock', password),
  save: value => invoke('save', value), lock: () => invoke('lock'), backup: () => invoke('backup'),
  importBackup: () => invoke('import-backup'), addDocument: () => invoke('add-document'), choosePhoto: () => invoke('choose-photo'),
  saveDocument: (name, content) => invoke('save-document', name, content), calendar: event => invoke('calendar', event)
}));
