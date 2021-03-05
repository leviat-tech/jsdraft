const chokidar = require('chokidar');
const fs = require('fs').promises;
const path = require('path');
const parseFilename = require('../utility/parse-filename.js');


function watchDirectory(watchPath, updateFile) {
  const watcher = chokidar.watch(watchPath, {
    ignored: /[/\\]\./,
    persistent: true,
  });

  // new/changed files
  watcher.on('change', async (p) => {
    const basename = path.basename(p);
    const dirname = path.dirname(p);
    const file = parseFilename(basename);

    if (file && dirname === watchPath) {
      const contents = await fs.readFile(p, 'utf-8');
      updateFile('change', {
        ...file,
        contents,
      });
    }
  });

  // removed files
  watcher.on('unlink', async (p) => {
    const basename = path.basename(p);
    const dirname = path.dirname(p);
    const file = parseFilename(basename);

    if (file && dirname === watchPath) {
      updateFile('unlink', file);
    }
  });

  return async () => {
    await watcher.close();
  };
}

module.exports = watchDirectory;
