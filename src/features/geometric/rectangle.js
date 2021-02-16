const Rectangle = require('../../entities/geometric/rectangle.js');


module.exports = function rectangle(sketch, ...args) {
  return sketch.create({
    entities: [new Rectangle(...args)]
  });
}
