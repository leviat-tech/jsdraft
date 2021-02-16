const Rectangle = require('../../entities/rectangle.js');


module.exports = function rectangle(sketch, ...args) {
  return sketch.add({
    geometry: [new Rectangle(...args)]
  });
}
