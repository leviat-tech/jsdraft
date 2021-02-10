const Rectangle = require('../../entities/rectangle.js');


module.exports = function rectangle(c, ...args) {
  c.node.geometry.push(new Rectangle(...args));
  return c;
}
