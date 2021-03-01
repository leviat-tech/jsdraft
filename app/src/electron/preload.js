const { contextBridge } = require('electron');
const openFileDialog = require('./open-file-dialog.js');


contextBridge.exposeInMainWorld('electron', {
  openFile: openFileDialog,
});
