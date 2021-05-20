const fs = require('fs');


async function renameFile(oldPath, newPath) {
  await fs.promises.rename(oldPath, newPath);
}

module.exports = renameFile;
