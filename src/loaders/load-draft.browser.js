const parse_filename = require('../utility/misc/parse-filename.js');

/*
The provided parameter, "d", should be an object. It can either have:

- Keys representing filenames and values representing the contents of the files
- A key named 'sketch-features', with an object value containing the names and contents of the files.
*/

function load_draft_file(d, Draft) {
  const draft = new Draft();

  const { _xrefs, ...dir } = d;

  const sketch_dir = dir['sketch-features']
    ? Object.entries(dir['sketch-features'])
    : Object.entries(dir);

  const files = sketch_dir
    .filter(([filename]) => parse_filename(filename))
    .map(([filename, contents]) => ({
      ...parse_filename(filename),
      contents,
    }));

  let index;
  try {
    index = dir['index.json']
      ? JSON.parse(dir['index.json'])
      : {};
  } catch (e) {
    index = {};
  }

  const settings = index.settings || {};
  const styles = index.styles || {};
  const xrefs = {};

  if (index.xrefs && _xrefs) {
    Object.keys(index.xrefs).forEach((name) => {
      xrefs[name] = load_draft_file(_xrefs[name], Draft);
    });
  }

  draft.settings = settings;
  draft.styles = styles;
  draft.xrefs = xrefs;

  files.forEach((file) => {
    draft.add_feature(file.name, file.extension, file.contents);
  });

  return draft;
}

module.exports = load_draft_file;
