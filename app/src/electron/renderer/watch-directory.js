const chokidar = require('chokidar');
const fs = require('fs').promises;
const { basename } = require('path');


let watcher = {};

async function watchDirectory(directory, commit, ignoreInitial) {
  if (watcher.close) await watcher.close();

  watcher = chokidar.watch(`${directory}/*.(sketch.js|sketch.yaml)`, {
    persistent: true,
    ignoreInitial: ignoreInitial || false,
  });

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
