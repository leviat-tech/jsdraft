const fs = require('fs');
const path = require('path');
const parse_filename = require('../utility/misc/parse-filename.js');
const load_draft_browser = require('./load-draft.browser.js');

function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

/*
The provided string, "d", can either be:

- The path to a single sketch function file.
- The path to a directory containing sketch feature functions.
- The path to a directory containing a subfolder named "sketch-features".
- The path to an "index.json" file within a .draft folder.
*/

function load_draft_file(d, Draft) {
  if (typeof d === 'object') return load_draft_browser(d, Draft);

  const draft = new Draft();

  if (!path.isAbsolute(d)) {
    d = path.join(process.cwd(), d);
  }

  const p = path.basename(d) === 'index.json' ? path.dirname(d) : d;

  if (isFile(p)) {
    const extension = path.extname(p);
    const name = path.basename(d, extension);
    draft.add_feature(
      name,
      extension.split('.')[1],
      fs.readFileSync(p, 'utf-8')
    );
    return draft;
  }

  const sketch_dir = fs.existsSync(path.join(p, 'sketch-features'))
    ? path.join(p, 'sketch-features')
    : p;

  const sketch_feature_files = fs.readdirSync(sketch_dir);

  let index;
  try {
    index = fs.existsSync(path.join(p, 'index.json'))
      ? JSON.parse(fs.readFileSync(path.join(p, 'index.json'), 'utf-8'))
      : {};
  } catch (e) {
    index = {};
  }

  const settings = index.settings || {};
  const styles = index.styles || {};
  const xrefs = {};

  if (index.xrefs) {
    Object.entries(index.xrefs).forEach(([name, rel_path]) => {
      const xref_path = path.join(d, rel_path);
      xrefs[name] = load_draft_file(xref_path, Draft);
    });
  }

  const files = sketch_feature_files
    .filter((file) => isFile(path.join(sketch_dir, file)))
    .map((filename) => parse_filename(filename))
    .filter((file) => file)
    .map((file) => ({
      ...file,
      contents: fs.readFileSync(path.join(sketch_dir, file.filename), 'utf-8'),
    }));

  files.forEach((file) => {
    draft.add_feature(file.name, file.extension, file.contents);
  });

  draft.settings = settings;
  draft.styles = styles;
  draft.xrefs = xrefs;

  return draft;
}

module.exports = load_draft_file;
