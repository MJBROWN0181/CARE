const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('care', {
  load: () => ipcRenderer.invoke('care:load'),
  save: (data) => ipcRenderer.invoke('care:save', data),
  importDocument: () => ipcRenderer.invoke('care:import-document'),
  openDocument: (filePath) => ipcRenderer.invoke('care:open-document', filePath)
});
