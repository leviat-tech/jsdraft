const fs = require('fs');
const path = require('path');


async function saveFile(savePath, files) {
  const fileList = [];
  const saveFiles = [];
  fileList.push(...Object.entries(files).map((file) => ({ file, path: '' })));

  while (fileList.length > 0) {
    const file = fileList.pop();
    if (typeof file.file[1] === 'object') {
      fileList.push(...Object.entries(file.file[1]).map((f) => ({ file: f, path: file.path + file.file[0] })));
    } else {
      saveFiles.push(fs.promises.writeFile(
        path.join(savePath, file.path, file.file[0]),
        file.file[1],
      ));
    }
  }

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
