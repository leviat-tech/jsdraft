const Circle = require('../../entities/circle.js');


module.exports = function circle(c, ...args) {
  c.node.geometry.push(new Circle(...args));
  return c;
}
