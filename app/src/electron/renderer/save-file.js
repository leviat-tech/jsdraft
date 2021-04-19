const fs = require('fs');
const path = require('path');


async function saveFile(savePath, draft) {
  const sketchFeatureDir = fs.existsSync(path.join(savePath, 'sketch-features'))
    ? path.join(savePath, 'sketch-features')
    : savePath;

  const saveFiles = Object.entries(draft.features.sketch)
    .map(([name, file]) => {
      const filePath = path.join(sketchFeatureDir, `${name}.${file.extension}`);
      return fs.promises.writeFile(filePath, file.contents);
    })
    .concat(fs.promises.writeFile(
      path.join(savePath, 'index.json'),
      JSON.stringify(draft.meta, null, 2),
    ));

  await Promise.all(saveFiles);
  return true;
}

module.exports = saveFile;
