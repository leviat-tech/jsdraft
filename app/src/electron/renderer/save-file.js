const fs = require('fs').promises;
const path = require('path');


async function saveFile(savePath, sketches) {
  const saveFiles = sketches
    .map((sketch) => {
      const filename = `${sketch.name}.sketch.${sketch.filetype}`;
      const filePath = path.join(savePath, filename);
      return fs.writeFile(filePath, sketch.contents);
    });

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
