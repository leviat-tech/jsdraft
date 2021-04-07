const flatten = require('@flatten-js/core');


module.exports = function subtract(sketch, ...args) {
  let a;
  let b;
  if (args.length === 1) {
    a = sketch.shape;
    b = args[0];
  } else {
    a = args[0];
    b = args[1];
  }

  const c = flatten.BooleanOperations.subtract(a, b);
  return sketch.create({ entity: c });
};
