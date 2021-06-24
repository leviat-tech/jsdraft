const flatten = require('@flatten-js/core');


module.exports = function scale(sketch, sx, sy) {
  return sketch.transform(flatten.matrix().scale(sx, sy));
};
