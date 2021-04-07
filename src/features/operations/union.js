const flatten = require('@flatten-js/core');
const convert = require('../../utility/validation/convert.js');
const assert = require('../../utility/validation/assert.js');


module.exports = function union(sketch, ...args) {
  let a;
  let b;
  if (args.length === 1) {
    a = assert(sketch.shape, 'polyface');
    b = convert(args[0], 'polyface');
  } else {
    a = convert(args[0], 'polyface');
    b = convert(args[1], 'polyface');
  }

  const c = flatten.BooleanOperations.unify(a, b);
  return sketch.create({ entity: c });
};
