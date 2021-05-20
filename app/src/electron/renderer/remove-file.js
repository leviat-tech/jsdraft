const fs = require('fs');


async function removeFile(path) {
  await fs.promises.unlink(path);
}

module.exports = removeFile;
