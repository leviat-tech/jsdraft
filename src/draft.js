const parse = require('./loaders/parse.js');
const Sketch = require('./sketch/sketch.js');
const render = require('./render.js');
const { parameters } = require('./loaders/parameters.js');
const load_draft_file = require('./loaders/load-draft.js');


class Draft {
  constructor() {
    this.features = {
      sketch: {},
    };

    this.meta = {
      filetype: 'JSDraft',
      version: '0.0.1',
    };
  }

  add_feature(name, type, extension, contents) {
    this.features[type][name] = {
      extension, // yaml or js
      contents, // raw string of file contents
    };

    Object.defineProperty(this.features[type][name], 'parameters', {
      get: function get() {
        return parameters(this.features[type][name]);
      }.bind(this),
    });
  }

  rename_feature(old_name, new_name, type = 'sketch') {
    const { extension, contents } = this.features[type][old_name];

    this.add_feature(new_name, type, extension, contents);
    this.remove_feature(old_name, type);
  }

  remove_feature(name, type = 'sketch') {
    delete this.features[type][name];
  }

  // Note: this load function is Node-only
  static load(d) {
    return load_draft_file(d, Draft);
  }

  render(name, params, format, options = {}) {
    let type;
    if (options.type) {
      type = options.type;
    } else {
      type = this.features.sketch[name]
        ? 'sketch'
        : 'model';
    }

    const source = this.features[type][name];
    const root = new Sketch();
    Object.keys(this.features.sketch).forEach((key) => {
      const file = this.features.sketch[key];
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
