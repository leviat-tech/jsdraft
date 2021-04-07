const { v4: uuidv4 } = require('uuid');
const cloneDeep = require('lodash/cloneDeep');
const iterators = require('./iterators');
const features = require('../features');
const { decorate } = require('../loaders/javascript');


class Sketch {

  // construct a new empty sketch
  constructor(options) {
    this.node = {
      id: uuidv4(), // id: the uuid of node
      name: '', // name: the name of this node
      feature: '', // feature: the name of the feature function that created this node
      hidden: false, // hidden: if false this node should not be rendered (except console renderer)
      style: {}, // style: stroke, fill, etc that should be applied to paths in decendent nodes
      entity: null, // entity: a geometric, text, or other element attached to this node
      children: [], // children: nodes attached as decendents to this node
      attributes: {}, // attributes: a free space for meta data associated with this node
      index: {}, // injected user feature index
    };
    options = options || {};
    delete options.uuidv4;
    this.node = { ...this.node, ...options };
    this.node.index.binding = () => this;
  }

  // add child sketches to sketch
  add(...args) {
    args.forEach((arg) => {
      // A sketch is added as a child node
      if (arg instanceof Sketch) {
        this.node.children.push(arg);

      // Entities can also be added as child nodes
      } else {
        this.node.children.push(this.create({ entity: arg }));
      }
    });
    return this;
  }

  // convenience getter for new blank sketch
  get new() {
    return new Sketch({ index: cloneDeep(this.node.index) });
  }

  // create new sketch
  create(options) {
    return new Sketch({ index: cloneDeep(this.node.index), ...options });
  }

  // return a clone of this sketch
  clone() {
    return Sketch.clone(this);
  }

  // construct a clone of a sketch
  static clone(sketch) {
    return new Sketch(cloneDeep(sketch.node));
  }

  // create iterator to traverse entities in sketch
  * entities(order = 'depth') {
    for (const s of this.tree(order)) {
      if (s.node.entity) yield s.node.entity;
    }
  }

  // create iterator to traverse the sketch
  tree(order) {
    return iterators[order || 'post'](this);
  }

  // find first node where condition returns true (searched in level order)
  find(condition, order) {
    for (const sketch of this.tree(order)) {
      if (condition(sketch)) return sketch;
    }
    return null;
  }

  // query sketch for first availiable geometric entity
  get shape() {
    const sketch = this.find((s) => s.node.entity);
    if (sketch) {
      return sketch.node.entity;
    }
    throw Error("Called shape on a sketch that doesn't have a single shape.", this);

  }

  // access user defined / injected features
  get user() {
    return this.node.index;
  }

  // create feature from a vanilla function
  static featurize(func) {
    const cls = this;
    function feature(...args) {
      const input = cls.clone(this);
      const output = func.bind(this.binding ? this.binding() : this)(input, ...args);
      output.node.feature = output.node.feature || func.identifier || func.name;
      return output;
    }
    feature.identifier = func.identifier || func.name;
    return feature;
  }

  // globally provide a feature function to sketch
  static include(func, target) {
    const feature = Sketch.featurize(func);
    (target || this.prototype)[feature.identifier] = feature;
  }

  // inject user defined feature onto sketch and all copies created from sketch
  inject(func) {
    const feature = Sketch.featurize(func);
    this.node.index[feature.identifier] = feature;
  }
}

// include all built in js feature functions
features.forEach((feature) => Sketch.include(decorate(feature)));


module.exports = Sketch;
