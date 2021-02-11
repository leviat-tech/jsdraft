const { v4: uuidv4 } = require('uuid');
var cloneDeep = require('lodash.clonedeep');
const glob = require('glob');
const path = require('path');


class Composition {

  // construct a new empty composition
  constructor(options) {
    this.node = {
      id: uuidv4(),
      name: '',
      type: '',
      tags: new Set([]),
      draft: '',
      coloring: {},
      geometry: [],
      children: []
    };
    this.node = {...this.node, ...(options || {})}
  }

  get shape() {
    if (this.node.geometry.length == 1) {
      return this.node.geometry[0];
    } else {
      throw Error("Called shape on a composition that doesn't have a single shape.", this);
    }
  // convenience getter for new blank composition
  get new() {
    return new Composition();
  }

  // create new composition
  create(options) {
    return new Composition(options);
  }

  // append a child (composition can either be a sketch object or options used to create a new sketch)
  add(sketch) {
    if (!(sketch instanceof Composition)) {
      sketch = new Composition(sketch)
    }
    this.node.children.push(sketch)
    return this;
  }

  // append multiple children
  group(...sketches) {
    sketches.forEach(s => this.add(s))
    return this;
  }

  // return a clone of this composition
  clone() {
    return Composition.clone(this);
  }

  // construct a clone of a composition
  static clone(composition) {
    const copy = new Composition();
    copy.node = cloneDeep(composition.node);
    return copy;
  }

  // create iterator to traverse the sketch tree
  tree(order) {
    return iterators[order || 'level'](this);
  }

  // find first node where condition returns true (searched in level order)
  find(condition, order) {
    for (const sketch of this.tree(order)) {
      if (condition(sketch)) return sketch;
    }
  }
  // dynamically provide a draft function to composition without polluting prototype
  include(...paths) {
    this.constructor.include(require(path.join(...paths)), this)
  }

  // dynamically provide a draft function to composition
  static include(func, target) {
    const cls = this;
    const decorated = function(...args) {
      const input = cls.clone(this);
      const output = func(input, ...args);
      output.node.draft = func.name;
      return output;
    };
    (target || this.prototype)[func.name] = decorated;
  }
};


// include all built in js draft functions
const modules = glob.sync('./features/**/*.js', {cwd: __dirname});
modules.forEach(m => Composition.include(require(m)));

// include all built in yaml functions
const sketches = glob.sync('./features/**/*.yaml', {cwd: __dirname}).map(p => path.join(__dirname, p));
sketches.forEach(p => Composition.include(dyaml.load(p)))



module.exports = Composition;
