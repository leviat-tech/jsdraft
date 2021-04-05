const Arc = require('../../entities/geometric/arc.js');


module.exports = function arc(sketch, ...args) {
  return sketch.add(new Arc(...args));
};
