const Text = require('../../entities/annotation/text');


module.exports = function text(sketch, ...args) {
  return sketch.add(new Text(...args));
};
