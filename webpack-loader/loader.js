const fs = require('fs');
const path = require('path');
const set = require('lodash/set');
const toSource = require('tosource');


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

function fileContents(files, root, dir = '') {
  return files
    .filter((file) => isFile(path.join(root, dir, file)))
    .filter((file) => isValidFilename(file))
    .map((file) => ({
      path: dir ? `${dir}/${file}` : file,
      contents: fs.readFileSync(path.join(root, dir, file), 'utf-8'),
    }));
}

function getFile(p) {
  const rootFiles = fs.readdirSync(p);
  const sketchFeatures = fs.existsSync(path.join(p, 'sketch-features'))
    ? fs.readdirSync(path.join(p, 'sketch-features'))
    : [];

  const f = [
    ...fileContents(rootFiles, p),
    ...fileContents(sketchFeatures, p, 'sketch-features'),
  ];

  const files = f.reduce((obj, file) => {
    const p = file.path.split('/');
    set(obj, p, file.contents);
    return obj;
  }, {});

  return files;
}

function loader() {
  const files = getFile(this.context);

  return `
    import { Draft } from '@crhio/jsdraft';

    const files = ${toSource(files)};

    const draft = Draft.load(files);

    export default draft;
  `;
}

module.exports = loader;
