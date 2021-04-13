const confirm = require('./confirm.js');


function assert(value, type, sketch) {
  if (confirm(value, type, sketch)) return value;
  throw new TypeError(`Value ${value} does not conform to type ${type}`);
}

module.exports = assert;
