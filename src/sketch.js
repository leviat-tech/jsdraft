import { v4 as uuidv4 } from 'uuid';
import math from './lib/mathjs.js';
import features from './features/index.js';
import validate from './validations/validate.js';


class Sketch {
  // construct a new empty sketch
  constructor() {
    this._node = {

      // Unique id for this sketch node
      id: uuidv4(),

      // Nodes created by calling features will have a "type"
      // that corresponds to the function that was used to create it
      type: 'root',

      // A list of uuids for all visible entities at this node.
      entities: [],

      // An object representing all entities known to a given node. Non-visible
      // entities may be present in this object because they can be referenced
      // by subsequent geometric operations. Keys are the uuid of the node. Once added
      // to the context object, nothing is ever deleted from it.
      entities_hash: {},

      // A collection of any tags or vars that have been added to the sketch
      tags: {},

      // The evaluation context of this node's parent (i.e., if the node is a nested tag)
      parent_context: null,
    };
  }

  entities() {
    return this._node.entities.map((id) => this._node.entities_hash[id]);
  }

  points() {
    return this.entities().filter((entity) => entity.type === 'point');
  }

  curves() {
    return this.entities().filter((entity) => entity.type === 'curve');
  }

  polycurves() {
    return this.entities().filter((entity) => entity.type === 'polycurve');
  }

  compound_polycurves() {
    return this.entities().filter((entity) => entity.type === 'compound_polycurve');
  }

  // return a clone of this sketch
  clone() {
    return Sketch.clone(this);
  }

  // construct a clone of a sketch
  static clone(sketch) {
    const copy = new Sketch();
    copy._node.type = sketch._node.type;
    copy._node.entities = [...sketch._node.entities];
    copy._node.entities_hash = { ...sketch._node.entities_hash };
    copy._node.tags = { ...sketch._node.tags };
    copy._node.parent_context = sketch._node.parent_context;
    Object.keys(copy._node.tags).forEach((tag) => {
      const tag_name = `$${tag}`;
      copy[tag_name] = sketch[tag_name];
    });
    return copy;
  }

  // construct a leaf node of a sketch
  static leaf(sketch) {
    const copy = new Sketch();
    copy._node.type = 'tag';
    copy._node.entities_hash = { ...sketch._node.entities_hash };
    copy._node.parent_context = sketch._context();
    return copy;
  }

  // create entities and return a new sketch
  create_entities(...entities) {
    const sketch = this.clone();
    entities.forEach((entity) => {
      const id = uuidv4();
      sketch._node.entities_hash[id] = entity;
      sketch._node.entities.push(id);
    });
    return sketch;
  }

  // add a new tagged sketch. tags/vars of this child sketch will be namespaced
  // by the tag name.
  tag(name, callback) {
    const sketch = this.clone();
    const leaf = Sketch.leaf(this);
    const tag_name = `$${name}`;
    sketch[tag_name] = callback(leaf);

    sketch[tag_name]._node.entities.forEach((id) => {
      sketch._node.entities.push(id);
      sketch._node.entities_hash[id] = sketch[tag_name]._node.entities_hash[id];
    });

    sketch._node.tags[name] = 'tag';

    return sketch;
  }

  // Add a var to the sketch.
  var(name, expression) {
    const sketch = this.clone();
    const var_name = `$${name}`;
    sketch[var_name] = math.evaluate(expression, this._context());
    sketch._node.tags[name] = 'var';
    return sketch;
  }

  // compute the evaluation context for this sketch
  _own_context() {
    return Object.entries(this._node.tags).reduce((ctx, [tag, type]) => {
      const tag_name = `$${tag}`;

      // Tags will have their own evaluation context
      if (type === 'tag') {
        ctx[tag] = this[tag_name]._own_context();

      // Vars will be added to context
      } else {
        ctx[tag] = this[tag_name];
      }

      return ctx;
    }, {
      points: this.points(),
      curves: this.curves(),
      polycurves: this.polycurves(),
      compound_polycurves: this.compound_polycurves(),
    });
  }

  // compute the evaluation context for this sketch and enclosing scope
  _context() {
    return {
      // get parent context
      ...this._node.parent_context,

      // get own context
      ...this._own_context(),
    };
  }

  // dynamically provide a feature to sketch
  static include(feature) {
    const decorated = function feat(...args) {
      const validatedArgs = args.map((arg, i) => validate(feature.parameters[i], arg));
      const input = this.clone();
      const output = feature.func(input, ...validatedArgs);
      output._node.type = feature.name;
      return output;
    };
    this.prototype[feature.name] = decorated;
  }
}


// include all basic draft functions
Object.values(features).forEach((feature) => { Sketch.include(feature); });

export default Sketch;
