const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const { basename } = require('path');


function featureType(base, filePath) {
  const p = path.relative(base, filePath).split('/');
  const extension = p[p.length - 1].split('.').pop();
  if (!['js', 'yaml'].includes(extension)) return null;
  if (!fs.existsSync(path.join(base, 'sketch-features'))) return 'sketch';
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
        code: await fs.promises.readFile(p, 'utf-8'),
      });
    }
  });
  watcher.on('change', async (p) => {
    const type = featureType(directory, p);
    if (type) {
      commit('updateFile', {
        name: basename(p),
        code: await fs.promises.readFile(p, 'utf-8'),
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
