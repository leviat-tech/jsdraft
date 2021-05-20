const { ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const saveFile = require('./save-file.js');


async function saveFileDialog(name, files) {
  const directory = await ipcRenderer.invoke('save-as', name);
  if (directory.canceled) return { canceled: true };
  const d = directory.filePath;
  const extension = path.extname(d);
  const p = extension === '.draft' ? d : `${d}.draft`;
  const filename = path.basename(p);

  await fs.mkdir(p);
  await saveFile(p, files);
  return { filename, path: p };
}

module.exports = saveFileDialog;
