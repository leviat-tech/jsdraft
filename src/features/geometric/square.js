const Rectangle = require('../../entities/rectangle.js');


module.exports = function square(sketch, ...args) {
  return sketch.add({
    geometry: [new Rectangle(...args)]
  });
}
