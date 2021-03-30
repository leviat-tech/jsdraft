const parse = require('./loaders/parse.js');
const Sketch = require('./sketch/sketch.js');
const render = require('./render');


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
  }

  rename_file(old_name, new_name) {
    const { type, extension, contents } = this.files[old_name];

    this.add_file(new_name, type, extension, contents);
    this.remove_file(old_name);
  }

  remove_file(name) {
    delete this.files[name];
  }

  render(name, params, format, options) {
    const source = this.files[name];
    const root = new Sketch();
    Object.keys(this.files).forEach((key) => {
      const file = this.files[key];
      root.inject(parse(file.extension, file.contents, key));
    });
    const func = parse(source.extension, source.contents, source.name);
    const sketch = func(root, ...params);
    return render(sketch, format, options);
  }
}

module.exports = Draft;
