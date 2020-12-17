const Rectangle = require('../../shapes/rectangle.js');


module.exports = function square(c, ...args) {
  c.node.geometry.push(new Rectangle(...args));
  return c;
}
