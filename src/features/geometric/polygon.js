const Polygon = require('../../entities/geometric/polygon.js');


module.exports = function polygon(sketch, ...args) {
  return sketch.create({
    entities: [new Polygon(...args)]
  });
}
