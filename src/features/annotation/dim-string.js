const DimString = require('../../entities/annotation/dim-string.js');


module.exports = function dim_string(sketch, ...args) {
  return sketch.add(new DimString(...args));
};
