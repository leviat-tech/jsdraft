const { contextBridge } = require('electron');
const openFile = require('./open-file.js');
const fileExists = require('./file-exists.js');
const getFile = require('./get-file.js');
const removeFile = require('./remove-file.js');
const renameFile = require('./rename-file.js');
const saveAs = require('./save-as.js');
const saveFile = require('./save-file.js');
const watchDirectory = require('./watch-directory.js');


contextBridge.exposeInMainWorld('electron', {
  openFile,
  fileExists,
  getFile,
  removeFile,
  renameFile,
  saveAs,
  saveFile,
  watchDirectory,
});
