const Rectangle = require('../../entities/geometric/rectangle.js');


module.exports = function rectangle(sketch, ...args) {
  return sketch.add(new Rectangle(...args));
};
