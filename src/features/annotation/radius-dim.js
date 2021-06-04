const RadiusDim = require('../../entities/annotation/radius-dim.js');


module.exports = function radius_dim(sketch, ...args) {
  return sketch.add(new RadiusDim(...args));
};
