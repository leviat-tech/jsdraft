const fs = require('fs').promises;
const path = require('path');


async function saveFile(savePath, draft) {
  const saveFiles = Object.entries(draft.features.sketch)
    .map(([name, file]) => {
      const filePath = path.join(savePath, 'sketch-features', `${name}.${file.extension}`);
      return fs.writeFile(filePath, file.contents);
    })
    .concat(fs.writeFile(
      path.join(savePath, 'index.json'),
      JSON.stringify(draft.meta, null, 2),
    ));

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
