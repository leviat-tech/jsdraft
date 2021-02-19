const Polyline = require('../../entities/geometric/polyline.js');


module.exports = function polyline_segments(sketch, ...args) {
  return sketch.create({
    entities: [new Polyline(...args)],
  });
};
