const fs = require('fs');
const path = require('path');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function parse_filename(filename) {
  const segments = filename.split('.');
  if (segments.length < 2
    || !segments[0]
    || !['js', 'yaml'].includes(segments[segments.length - 1])) {
    return null;
  }

  return {
    filename,
    name: segments.slice(0, -1).join('.'),
    extension: segments[segments.length - 1],
  };
}

function loader() {
  const sketchDir = fs.existsSync(path.join(this.context, 'sketch-features'))
    ? path.join(this.context, 'sketch-features')
    : this.context;

  const sketchFeatureFiles = fs.readdirSync(sketchDir);

  sketchFeatureFiles.forEach((file) => {
    this.addDependency(path.join(sketchDir + file));
  });

  const files = sketchFeatureFiles
    .filter((file) => isFile(path.join(sketchDir, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(sketchDir, file.filename), 'utf-8'),
    }));

  return `
    import { Draft } from '@crhio/jsdraft';

    const files = ${JSON.stringify(files)};

    const draft = new Draft();

    files.forEach((file) => {
      draft.add_feature(file.name, file.extension, file.contents);
    });

    export default draft;
  `;
}

module.exports = loader;
