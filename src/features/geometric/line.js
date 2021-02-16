const Line = require('../../entities/line.js');


module.exports = function line(sketch, ...args) {
  return sketch.add({
    geometry: [new Line(...args)]
  });
}
