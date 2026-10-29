const { contextBridge, ipcRenderer } = require('electron');
// Electron prefixes errors with "Error invoking remote method '<channel>': Error:"; show only CARE's own message.
const invoke = (channel, ...args) => ipcRenderer.invoke(channel, ...args).catch(err => { throw new Error(String(err?.message || err).replace(/^Error invoking remote method '[^']+': (?:Error: )?/, '')); });
const listen = channel => callback => { const handler = (_event, value) => callback(value); ipcRenderer.on(channel, handler); return () => ipcRenderer.removeListener(channel, handler); };
contextBridge.exposeInMainWorld('care', Object.freeze({
  getUpdateState: () => invoke('get-update-state'), checkUpdates: () => invoke('check-updates'), installUpdate: () => invoke('install-update'),
  onUpdateState: listen('update-state'), onLocked: listen('locked'), onSettings: listen('settings'),
  status: () => invoke('status'), create: password => invoke('create', password), unlock: password => invoke('unlock', password),
  save: value => invoke('save', value), lock: () => invoke('lock'), changePassword: (current, next) => invoke('change-password', current, next),
  backup: () => invoke('backup'), importBackup: () => invoke('import-backup'),
  getSettings: () => invoke('get-settings'), setSetting: (key, value) => invoke('set-setting', key, value),
  chooseBackupFolder: () => invoke('choose-backup-folder'), clearBackupFolder: () => invoke('clear-backup-folder'), autoBackupNow: () => invoke('auto-backup-now'),
  addDocument: () => invoke('add-document'), choosePhoto: () => invoke('choose-photo'),
  saveDocument: (name, fileId) => invoke('save-document', name, fileId), viewDocument: (name, fileId) => invoke('view-document', name, fileId),
  printSheet: (mode, name) => invoke('print-sheet', mode, name), calendar: event => invoke('calendar', event)
}));
