const entities = require('../../entities');
const confirm = require('./confirm');
const types = require('./types');
const normalize = require('../arguments/normalize');


function convert(value, type) {
  if (confirm(value, type)) return value;
  if (type === 'boolean') return Boolean(value);
  if (type === 'number') return Number(value);
  if (type === 'string') return String(value);
  if (type === 'array') return JSON.parse(String(value));
  if (type === 'object') return JSON.parse(String(value));
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
