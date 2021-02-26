const Face = require('../../entities/geometric/face.js');


module.exports = function face(sketch, ...args) {
  return sketch.create({
    entities: [new Face(...args)],
  });
};
