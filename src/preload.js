const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('care', {
  load: () => ipcRenderer.invoke('care:load'),
  save: (data) => ipcRenderer.invoke('care:save', data)
});
