const flatten = require('@flatten-js/core');


module.exports = function union(sketch, ...args) {
  let a;
  let b;
  if (args.length === 1) {
    a = sketch.shape;
    b = args[0];
  } else {
    a = args[0];
    b = args[1];
  }

  const c = flatten.BooleanOperations.unify(a, b);
  return sketch.create({ entity: c });
};
