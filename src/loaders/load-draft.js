const fs = require('fs');
const path = require('path');
const parse_filename = require('../utility/misc/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function load_draft_file(d, Draft) {
  const draft_dir = path.join(process.cwd(), d);
  const sketch_dir = path.join(draft_dir, 'sketch-features');

  const sketch_feature_files = fs.existsSync(sketch_dir)
    ? fs.readdirSync(sketch_dir)
    : [];

  const files = sketch_feature_files
    .filter((file) => isFile(path.join(sketch_dir, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(sketch_dir, file.filename), 'utf-8'),
    }));

  const draft = new Draft();
  files.forEach((file) => {
    draft.add_feature(file.name, file.extension, file.contents);
  });

  return draft;
}

module.exports = load_draft_file;
