const Multiline = require('../../entities/geometric/multiline.js');


module.exports = function multiline(sketch, ...args) {
  return sketch.create({
    entities: [new Multiline(...args)]
  });
}
