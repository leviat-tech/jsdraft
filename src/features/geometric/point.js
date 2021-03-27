const Point = require('../../entities/geometric/point.js');


module.exports = function point(sketch, ...args) {
  return sketch.add_entities(new Point(...args));
};
