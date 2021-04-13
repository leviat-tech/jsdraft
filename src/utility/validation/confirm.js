const isPlainObject = require('lodash/isPlainObject');
const entities = require('../../entities');
const capitalize = require('./capitalize');
const types = require('./types');


function confirm(value, type, sketch) {
  if (type === 'object') return isPlainObject(value);
  if (type === 'array') return Array.isArray(value);
  if (types.standard.includes(type)) return typeof value === type; // eslint-disable-line valid-typeof
  if (types.entity.includes(type)) return value instanceof entities[capitalize(type)];
  if (type === 'sketch') return value.constructor === sketch.constructor;
  throw new TypeError(`Unrecognized validation type: ${type}`);
}

module.exports = confirm;
