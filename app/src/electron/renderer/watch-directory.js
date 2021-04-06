const chokidar = require('chokidar');
const fs = require('fs').promises;
const { basename } = require('path');
// const parseFilename = require('../utility/parse-filename.js');


function watchDirectory(directory, commit) {
  const watcher = chokidar.watch(`${directory}/*.(sketch.js|sketch.yaml)`, { persistent: true });

  watcher.on('add', async (path) => {
    commit('updateFile', { name: basename(path), code: await fs.readFile(path, 'utf-8') });
  });
  watcher.on('change', async (path) => {
    commit('updateFile', { name: basename(path), code: await fs.readFile(path, 'utf-8') });
  });
  watcher.on('unlink', async (path) => {
    commit('removeFile', basename(path));
  });
}

module.exports = watchDirectory;
