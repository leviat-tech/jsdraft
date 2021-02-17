const Point = require('../../entities/geometric/point.js');


module.exports = function point(sketch, ...args) {
  return sketch.create({
    entities: [new Point(...args)]
  });
}
