const Segment = require('../../entities/geometric/segment.js');


module.exports = function segment(sketch, ...args) {
  return sketch.add_entities(new Segment(...args));
};
