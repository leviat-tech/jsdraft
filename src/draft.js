const fs = require('fs');
const path = require('path');
const parse = require('./loaders/parse.js');
const Sketch = require('./sketch/sketch.js');
const render = require('./render.js');
const { parameters } = require('./loaders/parameters.js');
const parse_filename = require('./utility/misc/parse-filename.js');


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

class Draft {
  constructor() {
    this.files = {};
  }

  add_file(name, type, extension, contents) {
    this.files[name] = {
      type, // sketch or model
      extension, // yaml or js
      contents, // raw string of file contents
    };

    Object.defineProperty(this.files[name], 'parameters', {
      get: function get() {
        return parameters(this.files[name]);
      }.bind(this),
    });
  }

  rename_file(old_name, new_name) {
    const { type, extension, contents } = this.files[old_name];

    this.add_file(new_name, type, extension, contents);
    this.remove_file(old_name);
  }

  remove_file(name) {
    delete this.files[name];
  }

  // Note: this load function is Node-only
  static load(d) {
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

  render(name, params, format, options) {
    const source = this.files[name];
    const root = new Sketch();
    Object.keys(this.files).forEach((key) => {
      const file = this.files[key];
      try {
        const feature = parse(file.extension, file.contents, key);
        root.inject(feature);
      } catch (error) {
        console.warn(`Failed to parse and inject ${key}: ${error}`);
      }
    });
    const func = parse(source.extension, source.contents, source.name);
    const sketch = func(root, ...params);
    return render(sketch, format, options);
  }
}

module.exports = Draft;
