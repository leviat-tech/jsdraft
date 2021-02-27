const load = require('./loaders/load.js');
const Sketch = require('./sketch/sketch.js');
const is_object = require('./utility/misc/is-object.js');
const svg_entities = require('./renderers/svg-entities.js');
const console_renderer = require('./renderers/console.js');


class Draft {
  constructor() {
    this.sketches = {};
    this.renderers = { // Perhaps a user could add a custom renderer to this object?
      'svg-entities': svg_entities,
      console: console_renderer,
    };
  }

  add_sketch(name, filetype, contents) {
    const func = load(name, filetype, contents);

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

  render(name, options, params) {
    const func = this.sketches[name].func;
    let sketch;
    if (is_object(params)) {
      sketch = func(new Sketch(), params);
    } else { // params is Array
      sketch = func(new Sketch(), ...params);
    }

    const { format, opts } = options;
    const renderer = this.renderers[format];
    return renderer(sketch, opts);
  }
}

module.exports = Draft;
