const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const parseFilename = require('../utility/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

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

  const sketchDir = fs.existsSync(path.join(p, 'sketch-features'))
    ? path.join(p, 'sketch-features')
    : p;

  const sketchFeatureFiles = await fs.promises.readdir(sketchDir);

  const files = sketchFeatureFiles
    .filter((file) => isFile(path.join(sketchDir, file)))
    .map((filename) => parseFilename(filename))
    .filter((file) => file)
    .map(async (file) => ({
      ...file,
      contents: await fs.promises.readFile(path.join(sketchDir, file.filename), 'utf-8'),
    }));

  return {
    filename: path.basename(directory.filePaths[0]),
    path: directory.filePaths[0],
    files: {
      sketch: await Promise.all(files),
    },
  };
}

module.exports = openFile;
