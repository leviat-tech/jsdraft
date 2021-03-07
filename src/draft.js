const parse = require('./loaders/parse.js');
const Sketch = require('./sketch/sketch.js');
const is_object = require('./utility/misc/is-object.js');
const svg = require('./renderers/svg.js');
const yaml = require('./renderers/yaml.js');
const json = require('./renderers/json.js');


class Draft {
  constructor() {
    this.sketches = {};
    this.renderers = { // Perhaps a user could add a custom renderer to this object?
      json, yaml, svg
    };
  }

  add_sketch(name, filetype, contents) {
    const func = parse(filetype, contents, name);
    this.sketches[name] = {
      filetype, // yaml or js
      contents, // raw string of file contents
      func, // the sketch's function
    };
  }

  rename_sketch(old_name, new_name) {
    const { filetype, contents } = this.sketches[old_name];

    this.add_sketch(new_name, filetype, contents);
    this.remove_sketch(old_name);
  }

  remove_sketch(name) {
    delete this.sketches[name];
  }

  render(name, params, format, options) {
    const func = this.sketches[name].func;
    const sketch = func(new Sketch(), ...params);
    const renderer = this.renderers[format];
    return renderer(sketch, options);
  }
}

module.exports = Draft;
