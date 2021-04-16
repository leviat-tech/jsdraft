const fs = require('fs').promises;
const path = require('path');


async function saveFile(savePath, files) {
  const saveFiles = files
    .map((file) => {
      const filename = `${file.name}.sketch.${file.extension}`;
      const filePath = path.join(savePath, filename);
      return fs.writeFile(filePath, file.contents);
    })

    // Adding a blank index file allows for simplified importing
    .concat(fs.writeFile(path.join(savePath, 'index.js'), ''));

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
