const Polyface = require('../../entities/geometric/polyface.js');


module.exports = function polyface(sketch, ...args) {
  return sketch.add(new Polyface(...args));
};
