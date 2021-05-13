const set = require('lodash/set');


module.exports = function linestyle(sketch, ...pattern) {
  const p = pattern.join(',');
  set(sketch.node.style, 'stroke.pattern', p);
  return sketch;
};
