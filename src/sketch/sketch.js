const { v4: uuidv4 } = require('uuid');
const cloneDeep = require('lodash/cloneDeep');
const iterators = require('./iterators');
const features = require('../features');
const { decorate } = require('../loaders/javascript');
const pick = require('../utility/misc/pick');
const { base_entity_type } = require('../utility/misc/entity-type.js');


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
      children: [], // children: nodes attached as descendents to this node
      attributes: {}, // attributes: a free space for meta data associated with this node
      index: {}, // injected user feature index (owner attribute allows reference sketch that owns the index)
    };
    if (Array.isArray(options)) {
      options = { entities: options };
    }
    options = options || {};
    delete options.uuidv4;
    this.node = { ...this.node, ...options };
    this.node.index.owner = () => this;
  }

  // add child sketches to sketch
  add(...args) {
    const clone = this.clone();
    args.forEach((arg) => {
      // A sketch is added as a child node
      if (arg instanceof Sketch) {
        clone.node.children.push(arg);

      // Entities can also be added as child nodes
      } else {
        clone.node.children.push(clone.create({ entity: arg }));
      }
    });
    return clone;
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

  vertex(i) {
    return pick(this.vertices, i);
  }

  get vertices() {
    return [].concat(...this.entities.map((e) => e.vertices));
  }

  edge(i) {
    return pick(this.edges, i);
  }

  get edges() {
    const result = [];

    for (const entity of this.entities) {
      const type = base_entity_type(entity);
      if (type === 'polycurve') {
        result.push(...entity.toShapes());
      } else if (type === 'polyface') {
        const edges = [...entity.edges].map((e) => e.shape);
        result.push(...edges);
      } else if (['arc', 'segment'].includes(type)) {
        result.push(entity);
      }
    }

    return result;
  }

  entity(i) {
    return pick(this.entities, i);
  }

  get polycurves() {
    return this.entities
      .filter((e) => base_entity_type(e) === 'polycurve');
  }

  get polyfaces() {
    return this.entities
      .filter((e) => base_entity_type(e) === 'polyface');
  }

  get entities() {
    return [...this.shapes()];
  }

  // create iterator to traverse entities in sketch
  * shapes(order = 'depth', show = 'visible') {
    for (const s of this.tree(order, show)) {
      if (s.node.entity) yield s.node.entity;
    }
  }

  // create iterator to traverse the sketch
  tree(order = 'post', show = 'visible') {
    return iterators[order](this, show);
  }

  // find first node where condition returns true (searched in level order)
  find(condition, order, show) {
    for (const sketch of this.tree(order, show)) {
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
    const id = func.identifier || func.name;
    function feature(...args) {
      try {
        // When we call a feature function we normally call sketch.feature() and "this" refers to sketch.
        // However, when we call a user defined feature things work a little bit differently, we call
        // sketch.user.custom_feature().  When we call a feature function this way, "this" refers to
        // sketch.user (sketch.node.index) the index of custom user feature functions.  This is a problem because
        // we want the scoped user feature index, but we need "this" to point to the sketch.  So inside every
        // index we added a reference to the sketch that own it called "owner".  And when we call the feature
        // function we bind this to the sketch not sketch.user (the index).  So calling sketch.user.custom_feature
        // works like calling sketch.custom_feature(), but the custom_feature is stored in a seperate index name space
        // so user defined functions don't clash with built in feature functions.
        // Note: Any clone of this sketch or derivative of this sketch via new create or clone should also share
        // the index of the sketch it was derived from, which is why there is that extra code to preserve the
        // index in the new, create and clone functions.
        const sketch = this.owner ? this.owner() : this;
        const input = cls.clone(sketch);
        const output = func.bind(sketch)(input, ...args);
        output.node.feature = output.node.feature || func.identifier || func.name;
        return output;
      } catch (error) {
        throw new Error(`Error executing ${id}: ${error}`);
      }
    }
    feature.identifier = id;
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
