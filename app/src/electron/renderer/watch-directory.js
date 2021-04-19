const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const { basename } = require('path');


function featureType(base, filePath) {
  const p = filePath.relative(base, path).split('/');
  if (p.length > 1 && p[0] === 'sketch-features') return 'sketch';
  return null;
}

let watcher = {};

async function watchDirectory(directory, commit, ignoreInitial) {
  if (watcher.close) await watcher.close();

  watcher = chokidar.watch(`${directory}/**/*.(js|yaml|json)`, {
    persistent: true,
    ignoreInitial: ignoreInitial || false,
  });

  watcher.on('add', async (p) => {
    const type = featureType(directory, p);
    if (type) {
      commit('updateFile', {
        name: basename(p),
        type,
        code: await fs.readFile(p, 'utf-8'),
      });
    }
  });
  watcher.on('change', async (p) => {
    const type = featureType(directory, p);
    if (type) {
      commit('updateFile', {
        name: basename(p),
        code: await fs.readFile(p, 'utf-8'),
        type,
      });
    }
  });
  watcher.on('unlink', async (p) => {
    const type = featureType(directory, p);
    if (type) {
      commit('removeFile', { name: basename(p), type });
    }
  });
}

module.exports = watchDirectory;
