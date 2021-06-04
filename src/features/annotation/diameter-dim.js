const DiameterDim = require('../../entities/annotation/diameter-dim.js');


module.exports = function diameter_dim(sketch, ...args) {
  return sketch.add(new DiameterDim(...args));
};
