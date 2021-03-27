const fs = require('fs').promises;
const path = require('path');


async function saveFile(savePath, files) {
  const saveFiles = files
    .map((file) => {
      const filename = `${file.name}.sketch.${file.filetype}`;
      const filePath = path.join(savePath, filename);
      return fs.writeFile(filePath, file.contents);
    });

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
