const Segment = require('../../entities/geometric/segment.js');


module.exports = function segment(sketch, ...args) {
  return sketch.add(new Segment(...args));
};
