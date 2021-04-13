const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const parseFilename = require('../utility/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

async function openFile() {
  const directory = await ipcRenderer.invoke('open-file');
  const d = directory.filePaths[0];
  const directoryFiles = await fs.promises.readdir(d);
  const files = directoryFiles
    .filter((file) => isFile(path.join(d, file)))
    .map((filename) => parseFilename(filename))
    .filter((file) => file)
    .map(async (file) => ({
      ...file,
      contents: await fs.promises.readFile(path.join(d, file.filename), 'utf-8'),
    }));

  return {
    filename: path.basename(d),
    path: d,
    files: await Promise.all(files),
  };
}

module.exports = openFile;
