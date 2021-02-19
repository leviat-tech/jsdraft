const ClosedPolyline = require('../../entities/geometric/closed-polyline.js');


module.exports = function closed_polyline(sketch, ...args) {
  return sketch.create({
    entities: [new ClosedPolyline(...args)],
  });
};
