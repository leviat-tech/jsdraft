const Line = require('../../shapes/line.js');


module.exports = function line(c, ...args) {
  c.node.geometry.push(new Line(...args));
  return c;
}
