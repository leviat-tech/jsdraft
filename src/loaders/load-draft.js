const fs = require('fs');
const path = require('path');
const parse_filename = require('../utility/misc/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function load_draft_file(d, Draft) {
  const directoryFiles = fs.readdirSync(path.join(process.cwd(), d));

  const files = directoryFiles
    .filter((file) => isFile(path.join(d, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(process.cwd(), d, file.filename), 'utf-8'),
    }));

  const draft = new Draft();
  files.forEach((file) => {
    draft.add_file(file.name, file.type, file.extension, file.contents);
  });

  return draft;
}

module.exports = load_draft_file;
