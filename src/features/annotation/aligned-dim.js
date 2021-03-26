const AlignedDim = require('../../entities/annotation/aligned-dim');


module.exports = function aligned_dim(sketch, ...args) {
  return sketch.add(sketch.create({ entities: [new AlignedDim(...args)] }));
};
