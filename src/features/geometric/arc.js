const Arc = require('../../entities/geometric/arc.js');


module.exports = function arc(sketch, ...args) {
  return sketch.add_entities(new Arc(...args));
};
