const AngleDim = require('../../entities/annotation/angle-dim.js');


module.exports = function angle_dim(sketch, ...args) {
  return sketch.add(new AngleDim(...args));
};
