const Rectangle = require('../../entities/geometric/rectangle.js');


module.exports = function square(sketch, ...args) {
  return sketch.add({
    entities: [new Rectangle(...args)]
  });
}
