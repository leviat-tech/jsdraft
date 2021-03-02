const { ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const parseFilename = require('../utility/parse-filename.js');


async function openFile() {
  const directory = await ipcRenderer.invoke('open-file');
  const d = directory.filePaths[0];
  const directoryFiles = await fs.readdir(d);
  const files = directoryFiles
    .map((filename) => parseFilename(filename))
    .filter((file) => file)
    .map(async (file) => ({
      ...file,
      contents: await fs.readFile(path.join(d, file.filename), 'utf-8'),
    }));

  return {
    filename: path.basename(d),
    path: d,
    files: await Promise.all(files),
  };
}

module.exports = openFile;
