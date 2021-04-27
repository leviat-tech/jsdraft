const { ipcRenderer } = require('electron');
const path = require('path');
const getFile = require('./get-file.js');

/*
The imported file could be:

- a single sketch function file
- a directory containing sketch feature functions
- a directory containing a subfolder named "sketch-features"
- an "index.json" file within a .draft folder
*/

async function openFile() {
  const directory = await ipcRenderer.invoke('open-file');

  const d = directory.filePaths[0];

  const p = path.basename(d) === 'index.json' ? path.dirname(d) : d;

  const files = await getFile(p);

  return {
    filename: path.basename(directory.filePaths[0]),
    path: directory.filePaths[0],
    files,
  };
}

module.exports = openFile;
