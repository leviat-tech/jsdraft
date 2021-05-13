const set = require('lodash/set');


module.exports = function hatch(sketch, pattern, scale, angle, color, background) {
  set(sketch.node.style, 'fill.hatch', pattern);
  if (angle) set(sketch.node.style, 'fill.hatch_angle', angle);
  if (scale) set(sketch.node.style, 'fill.hatch_scale', scale);
  if (color) set(sketch.node.style, 'fill.hatch_color', color);
  if (background) set(sketch.node.style, 'fill.hatch_background', background);
  return sketch;
};
