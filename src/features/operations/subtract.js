const flatten = require('@flatten-js/core');

module.exports = function subtract(sketch, a, b) {
  const c = flatten.BooleanOperations.subtract(a, b)
  return sketch.create({
    entities: [c]
  });
}
