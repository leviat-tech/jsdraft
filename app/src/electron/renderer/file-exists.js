const fs = require('fs');


async function fileExists(path) {
  try {
    await fs.promises.stat(path);
  } catch {
    return false;
  }

  return true;
}

module.exports = fileExists;
