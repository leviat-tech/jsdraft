const confirm = require('./confirm.js');


function assert(value, type) {
  if (confirm(value, type)) return value;
  throw new TypeError(`Value ${value} does not conform to type ${type}`);
}

module.exports = assert;
