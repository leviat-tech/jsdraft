const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');


let watcher = {};

async function watchDirectory(directory, commit) {
  if (watcher.close) await watcher.close();


  try {
    await fs.stat(directory);
  } catch {
    return;
  }

  watcher = chokidar.watch(`${directory}/**/*.(js|yaml|json)`, {
    persistent: true,
    ignoreInitial: true,
  });

  watcher.on('add', async (p) => {
    const filepath = path.relative(directory, p);
    const code = await fs.readFile(p, 'utf-8');

    commit('updateFile', { path: filepath, code });
    commit('updateDiskFile', { path: filepath, code });
  });

  watcher.on('change', async (p) => {
    const filepath = path.relative(directory, p);
    const code = await fs.readFile(p, 'utf-8');

    commit('updateFile', { path: filepath, code });
    commit('updateDiskFile', { path: filepath, code });
  });

  watcher.on('unlink', async (p) => {
    const filepath = path.relative(directory, p);

    commit('removeFile', filepath);
    commit('removeDiskFile', filepath);
  });
}

module.exports = watchDirectory;
