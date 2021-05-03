const set = require('lodash/set');


module.exports = function fill(sketch, color, opacity) {
  sketch.node.style.fill = { color, opacity };
  set(sketch.node.style, 'fill.color', color);
  if (opacity) set(sketch.node.style, 'fill.opacity', opacity);
  return sketch;
};
