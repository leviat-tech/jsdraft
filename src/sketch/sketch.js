const { v4: uuidv4 } = require('uuid');
var cloneDeep = require('lodash.clonedeep');
const glob = require('glob');
const path = require('path');
const iterators = require('./iterators');
const load = require('../loaders/load');


class Sketch {

  // construct a new empty sketch
  constructor(options) {
    this.node = {
      id: uuidv4(),
      name: '',
      type: '',
      tags: new Set([]),
      draft: '',
      coloring: {},
      entities: [],
      children: []
    };
    this.node = {...this.node, ...(options || {})}
  }

  // convenience getter for new blank sketch
  get new() {
    return new Sketch();
  }

  // create new sketch
  create(options) {
    return new Sketch(options);
  }

  // append a child (sketch can either be a sketch object or options used to create a new sketch)
  add(sketch) {
    if (!(sketch instanceof Sketch)) {
      sketch = new Sketch(sketch)
    }
    this.node.children.push(sketch)
    return this;
  }

  // append multiple children
  group(...sketches) {
    sketches.forEach(s => this.add(s))
    return this;
  }

  // return a clone of this sketch
  clone() {
    return Sketch.clone(this);
  }

  // construct a clone of a sketch
  static clone(sketch) {
    const copy = new Sketch();
    copy.node = cloneDeep(sketch.node);
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

  // query sketch for first availiable geometric entity
  get shape() {
    const sketch = this.find(s => s.node.entities.length > 0);
    if (sketch) {
      return sketch.node.entities[0];
    } else {
      throw Error("Called shape on a sketch that doesn't have a single shape.", this);
    }
  }

  // dynamically provide a draft function to sketch without polluting prototype
  include(...paths) {
    this.constructor.include(require(path.join(...paths)), this)
  }

  // dynamically provide a draft function to sketch
  static include(func, target) {
    const cls = this;
    const decorated = function(...args) {
      const input = cls.clone(this);
      const output = func(input, ...args);
      output.node.draft = output.node.draft || func.identifier || func.name;
      return output;
    };
    (target || this.prototype)[func.identifier || func.name] = decorated;
  }
};


// include all built in js draft functions
const modules = glob.sync('../features/**/*.js', {cwd: __dirname}).map(p => path.join(__dirname, p));
modules.forEach(m => Sketch.include(load(m)));

// include all built in yaml functions
const sketches = glob.sync('../features/**/*.yaml', {cwd: __dirname}).map(p => path.join(__dirname, p));
sketches.forEach(p => Sketch.include(load(p)))



module.exports = Sketch;
