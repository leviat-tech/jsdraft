const Text = require('../../entities/annotation/text');


module.exports = function text(sketch, ...args) {
  return sketch.add(sketch.create({ entities: [new Text(...args)] }));
};
