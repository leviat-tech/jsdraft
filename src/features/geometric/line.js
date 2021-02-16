const Line = require('../../entities/geometric/line.js');


module.exports = function line(sketch, ...args) {
  return sketch.add({
    entities: [new Line(...args)]
  });
}
