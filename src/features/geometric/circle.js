const Circle = require('../../entities/geometric/circle.js');


module.exports = function circle(sketch, ...args) {
  return sketch.create({
    entities: [new Circle(...args)]
  });
}
