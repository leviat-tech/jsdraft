const parse_filename = require('../utility/misc/parse-filename.js');

/*
The provided parameter, "d", should be an object. It can either have:

- Keys representing filenames and values representing the contents of the files
- A key named 'sketch-features', with an object value containing the names and contents of the files.
*/

function load_draft_file(d, Draft) {
  const draft = new Draft();

  const sketch_dir = d['sketch-features']
    ? Object.entries(d['sketch-features'])
    : Object.entries(d);

  const files = sketch_dir
    .filter(([filename]) => parse_filename(filename))
    .map(([filename, contents]) => ({
      ...parse_filename(filename),
      contents,
    }));

  let index;
  try {
    index = d['index.json']
      ? JSON.parse(d['index.json'])
      : {};
  } catch (e) {
    index = {};
  }

  const settings = index.settings || {};

  draft.settings = settings;

  files.forEach((file) => {
    draft.add_feature(file.name, file.extension, file.contents);
  });

  return draft;
}

module.exports = load_draft_file;
