const flatten = require('@flatten-js/core');

module.exports = function rotate(sketch, angle, units) {
  if (!units) {
    angle = angle * Math.PI / 180.0
  }
  return sketch.transform(flatten.matrix().rotate(angle));
}
