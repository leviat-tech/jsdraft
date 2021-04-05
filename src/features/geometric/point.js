const Point = require('../../entities/geometric/point.js');


module.exports = function point(sketch, ...args) {
  return sketch.add(new Point(...args));
};
