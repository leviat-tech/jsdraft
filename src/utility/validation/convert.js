const entities = require('../../entities');
const confirm = require('./confirm');
const types = require('./types');
const normalize = require('../arguments/normalize');
const { base_entity_type } = require('../misc/entity-type.js');


function convert(value, type, sketch) {
  if (confirm(value, type, sketch)) return value;
  if (type === 'boolean') return Boolean(value);
  if (type === 'number') return Number(value);
  if (type === 'string') return String(value);
  if (type === 'array') return JSON.parse(String(value));
  if (type === 'object') return JSON.parse(String(value));
  if (type === 'sketch') {
    if (value.constructor === sketch.constructor) return value;
    if (types.entity.includes(base_entity_type(value))) return sketch.new.add(value);
  }
  if (types.entity.includes(type)) {
    value = normalize(value);
    if (Symbol.iterator in Object(value)) {
      return entities[type](...value);
    }
    return entities[type](value);
  }
  throw new TypeError(`Unrecognized validation type: ${type}`);
}

module.exports = convert;
