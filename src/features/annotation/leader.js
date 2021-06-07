const Leader = require('../../entities/annotation/leader.js');


module.exports = function leader(sketch, ...args) {
  return sketch.add(new Leader(...args));
};
