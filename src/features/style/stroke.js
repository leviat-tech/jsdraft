const set = require('lodash/set');


module.exports = function stroke(sketch, color, width, opacity) {
  set(sketch.node.style, 'stroke.color', color);
  if (width) set(sketch.node.style, 'stroke.width', width);
  if (opacity) set(sketch.node.style, 'stroke.opacity', opacity);
  return sketch;
};
