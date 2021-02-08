import { v4 as uuidv4 } from 'uuid';
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
      // entities may be present in the _context object because they can be referenced
      // by subsequent geometric operations. Keys are the uuid of the node. Once added
      // to the context object, nothing is ever deleted from it.
      context: {},
    };
  }

  entities() {
    return this._node.entities.map((id) => this._node.context[id]);
  }

  get points() {
    return this.entities.filter((entity) => entity.type === 'point');
  }

  get curves() {
    return this.entities.filter((entity) => entity.type === 'curve');
  }

  get polycurves() {
    return this.entities.filter((entity) => entity.type === 'polycurve');
  }

  get compound_polycurves() {
    return this.entities.filter((entity) => entity.type === 'compound_polycurve');
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
    copy._node.context = { ...sketch._node.context };
    return copy;
  }

  // construct a leaf node of a sketch
  static leaf(sketch) {
    const copy = new Sketch();
    copy._node.type = 'tag';
    copy._node.context = { ...sketch._node.context };
    return copy;
  }

  // create entities and return a new sketch
  create_entities(...entities) {
    const sketch = this.clone(); // TODO: Consider whether cloning here is necessary
    entities.forEach((entity) => {
      const id = uuidv4();
      sketch._node.context[id] = entity;
      sketch._node.entities.push(id);
    });
    return sketch;
  }

  // add a new tagged sketch. tags/vars of this child sketch will be namespaced
  // by the tag name.
  tag(name, callback) {
    const sketch = this.clone();
    const leaf = Sketch.leaf(this);
    this[name] = callback(leaf);

    this[name]._node.entities.forEach((id) => {
      sketch._node.entities.push(id);
      sketch._node.context[id] = this[name]._node.context[id];
    });

    return sketch;
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
