const { v4: uuidv4 } = require('uuid');
const cloneDeep = require('lodash/cloneDeep');
const iterators = require('./iterators');
const features = require('../features/index.js');


class Sketch {

  // construct a new empty sketch
  constructor(options) {
    this.node = {
      id: uuidv4(), // id: the uuid of node
      name: '', // name: the name of this node
      feature: '', // feature: the name of the feature function that created this node
      hidden: false, // hidden: if false this node should not be rendered (except console renderer)
      style: {}, // style: stroke, fill, etc that should be applied to paths in decendent nodes
      entities: [], // entities: all geometry, text, and other elements attached to this node
      children: [], // children: nodes attached as decendents to this node
      attributes: {}, // attributes: a free space for meta data associated with this node
      chain: null, // refers to parent sketch when sketch is being chained
    };
    this.node = { ...this.node, ...(options || {}) };
  }

  // convenience getter for new blank sketch
  get new() {
    const sketch = new Sketch();
    sketch.clone_dynamic_features(this);
    return sketch;
  }

  clone_dynamic_features(sketch) {
    const { node, ...dynamic_features } = sketch;
    Object.values(dynamic_features).forEach((f) => { this.include(f.original); });
  }

  // create new sketch
  create(options) {
    const sketch = new Sketch(options);
    sketch.clone_dynamic_features(this);
    return sketch;
  }

  // add entities to sketch
  add_entities(...entities) {
    this.node.entities.push(...entities);
    return this;
  }

  get chain() {
    const sketch = this.new;
    sketch.node.chain = this;
    return sketch;
  }

  draw(sketches) {
    if (this.node.chain) {
      return this.node.chain.add(this);
    }

    return this.add(...sketches);
  }

  // return a clone of this sketch
  clone() {
    return Sketch.clone(this);
  }

  // construct a clone of a sketch
  static clone(sketch) {
    const copy = new Sketch();
    copy.node = cloneDeep(sketch.node);
    copy.clone_dynamic_features(sketch);
    return copy;
  }

  // create iterator to traverse entities in sketch
  * entities(order) {
    for (const s of this.tree(order)) {
      for (const e of s.node.entities) {
        yield e;
      }
    }
  }

  // create iterator to traverse the sketch
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
    const sketch = this.find((s) => s.node.entities.length > 0);
    if (sketch) {
      return sketch.node.entities[0];
    }
    throw Error("Called shape on a sketch that doesn't have a single shape.", this);

  }

  // dynamically provide a feature function to sketch without polluting prototype
  include(func) {
    this.constructor.include(func, this);
  }

  // dynamically provide a feature function to sketch
  static include(func, target) {
    const cls = this;
    const decorated = function decorated(...args) {
      const input = cls.clone(this);
      const output = func(input, ...args);
      output.node.feature = output.node.feature || func.identifier || func.name;
      return output;
    };

    // dynamic functions not on prototype need to be preserved for cloning
    if (target) decorated.original = func;

    (target || this.prototype)[func.identifier || func.name] = decorated;
  }
}


// include all built in js feature functions
features.forEach((feature) => Sketch.include(feature));


module.exports = Sketch;
