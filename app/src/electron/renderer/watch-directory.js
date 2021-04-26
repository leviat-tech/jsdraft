const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');


let watcher = {};

async function watchDirectory(directory, commit, ignoreInitial) {
  if (watcher.close) await watcher.close();

  watcher = chokidar.watch(`${directory}/**/*.(js|yaml|json)`, {
    persistent: true,
    ignoreInitial: ignoreInitial || false,
  });

  watcher.on('add', async (p) => {
    commit('updateFile', {
      path: path.relative(directory, p),
      code: await fs.readFile(p, 'utf-8'),
    });
  });

  watcher.on('change', async (p) => {
    commit('updateFile', {
      path: path.relative(directory, p),
      code: await fs.readFile(p, 'utf-8'),
    });
  });

  watcher.on('unlink', async (p) => {
    commit('removeFile', path.relative(directory, p));
  });
}

module.exports = watchDirectory;
