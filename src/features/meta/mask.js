const Polyface = require('../../entities/geometric/polyface.js');


module.exports = function mask(sketch, ...args) {
  if (args.length === 0) {
    sketch.node.mask = null;
  } else {
    sketch.node.mask = new Polyface(...args);
  }

  return sketch;
};
