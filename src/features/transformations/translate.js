const flatten = require('@flatten-js/core');

module.exports = function translate(sketch, x, y) {
  return sketch.transform(flatten.matrix().translate(x, y));
}
