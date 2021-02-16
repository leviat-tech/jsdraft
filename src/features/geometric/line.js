const Line = require('../../entities/geometric/line.js');


module.exports = function line(sketch, ...args) {
  return sketch.create({
    entities: [new Line(...args)]
  });
}
