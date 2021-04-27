const set = require('lodash/set');
const fs = require('fs');
const path = require('path');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function isValidFilename(filename) {
  if (!filename) return false;

  const split = filename.split('.');
  return split.length > 1
    && split[0]
    && ['json', 'js', 'yaml'].includes(split[split.length - 1]);
}

function filePromises(files, root, dir = '') {
  return files
    .filter((file) => isFile(path.join(root, dir, file)))
    .filter((file) => isValidFilename(file))
    .map(async (file) => ({
      path: dir ? `${dir}/${file}` : file,
      contents: await fs.promises.readFile(path.join(root, dir, file), 'utf-8'),
    }));
}


async function getFile(p) {
  const rootFiles = await fs.promises.readdir(p);
  const sketchFeatures = await (fs.existsSync(path.join(p, 'sketch-features'))
    ? fs.promises.readdir(path.join(p, 'sketch-features'))
    : []);

  const f = await Promise.all([
    ...filePromises(rootFiles, p),
    ...filePromises(sketchFeatures, p, 'sketch-features'),
  ]);

  const files = f.reduce((obj, file) => {
    const p = file.path.split('/');
    set(obj, p, file.contents);
    return obj;
  }, {});

  return files;
}

module.exports = getFile;
