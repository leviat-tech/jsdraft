const { contextBridge } = require('electron');
const openFile = require('./open-file.js');
const saveAs = require('./save-as.js');
const saveFile = require('./save-file.js');
const watchDirectory = require('./watch-directory.js');


contextBridge.exposeInMainWorld('electron', {
  openFile,
  saveAs,
  saveFile,
  watchDirectory,
});
