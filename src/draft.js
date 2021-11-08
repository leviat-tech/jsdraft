const merge = require('lodash/merge');
const parse = require('./loaders/parse.js');
const Sketch = require('./sketch/sketch.js');
const render = require('./render.js');
const { parameters } = require('./loaders/parameters.js');
const load_draft_file = require('./loaders/load-draft.js');


class Draft {
  constructor(file) {
    if (file) {
      if (typeof file === 'string') {
        file = JSON.parse(file);
      }

      if (file._file_id === 'Serialized Draft') {
        return load_draft_file(file, Draft);
      }
    }

    this.features = {
      sketch: {},
    };

    this.settings = {};

    this.styles = {};

    this.xrefs = {};

    this.renderers = {};

    this.meta = {
      filetype: 'JSDraft',
      version: '0.0.3',
    };
  }

  toJSON() {
    const features = Object.entries(this.features.sketch)
      .reduce((d, [n, f]) => ({ ...d, [`${n}.${f.extension}`]: f.contents }), {});

    const index = {
      settings: this.settings,
      styles: this.styles,
      xrefs: {},
    };

    const _xrefs = Object.entries(this.xrefs).reduce((x, [name, xref]) => {
      index[name] = 'Serialized XREF';
      x[name] = JSON.stringify(xref);
      return x;
    }, {});

    return {
      ...features,
      _file_id: 'Serialized Draft',
      _xrefs,
    };
  }

  add_feature(name, extension, contents, type = 'sketch') {
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

    this.add_feature(new_name, extension, contents, type);
    this.remove_feature(old_name, type);
  }

  remove_feature(name, type = 'sketch') {
    delete this.features[type][name];
  }

  add_renderer(name, func) {
    this.renderers[name] = func;
  }

  remove_renderer(name) {
    delete this.renderers[name];
  }

  static load(d) {
    return load_draft_file(d, Draft);
  }

  get root() {
    const root = new Sketch();
    root.node.styles = this.styles;
    root.node.xrefs = this.xrefs;

    Object.keys(this.features.sketch).forEach((key) => {
      const file = this.features.sketch[key];
      try {
        const feature = parse(file.extension, file.contents, key);
        root.inject(feature);
      } catch (error) {
        console.warn(`Failed to parse and inject ${key}: ${error}`);
      }
    });

    return root;
  }

  render(name, params, format, options = {}) {
    let type;
    options = merge({}, this.settings, options);

    if (options.type) {
      type = options.type;
    } else {
      type = this.features.sketch[name]
        ? 'sketch'
        : 'model';
    }

    const source = this.features[type][name];
    const root = this.root;
    const func = parse(source.extension, source.contents, source.name);
    const sketch = func(root, ...params);

    // Check whether there is a user-provided renderer
    if (this.renderers[format]) {
      return this.renderers[format](sketch, options);
    }

    if (format === 'sketch') return sketch;
    return render(sketch, format, options);
  }
}

module.exports = Draft;
