const Circle = require('../../entities/circle.js');


module.exports = function circle(sketch, ...args) {
  return sketch.add({
    geometry: [new Circle(...args)]
  });
}
