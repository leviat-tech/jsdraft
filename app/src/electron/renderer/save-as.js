const { ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const saveFile = require('./save-file.js');


async function saveFileDialog(name, files) {
  const directory = await ipcRenderer.invoke('save-as', name);
  const d = directory.filePath;
  const extension = path.extname(d);
  const filename = extension === '.draft' ? d : `${d}.draft`;

  await fs.mkdir(filename);
  await saveFile(filename, files);
  return d;
}

module.exports = saveFileDialog;
