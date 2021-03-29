const Circle = require('../../entities/geometric/circle.js');


module.exports = function circle(sketch, ...args) {
  return sketch.add_entities(new Circle(...args));
};
