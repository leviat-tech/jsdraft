const fs = require('fs');
const path = require('path');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function parse_filename(filename) {
  const segments = filename.split('.');
  if (segments.length < 3 || !segments[0]) {
    return null;
  }

  return {
    filename,
    name: segments[0],
    type: segments[1],
    extension: segments[segments.length - 1],
  };
}

function loader() {
  const directoryFiles = fs.readdirSync(this.context);

  directoryFiles.forEach((file) => {
    this.addDependency(path.join(this.context + file));
  });

  const files = directoryFiles
    .filter((file) => isFile(path.join(this.context, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(this.context, file.filename), 'utf-8'),
    }));

  return `
    import { Draft } from '@crhio/jsdraft';

    const files = ${JSON.stringify(files)};

    const draft = new Draft();

    files.forEach((file) => {
      draft.add_file(file.name, file.type, file.extension, file.contents);
    });

    export default draft;
  `;
}

module.exports = loader;
