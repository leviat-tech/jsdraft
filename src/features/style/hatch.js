const set = require('lodash/set');


module.exports = function hatch(sketch, pattern, scale, angle, color, background, stroke_width) {
  set(sketch.node.style, 'fill.hatch', pattern);
  if (angle) set(sketch.node.style, 'fill.hatch_angle', angle);
  if (scale) set(sketch.node.style, 'fill.hatch_scale', scale);
  if (color) set(sketch.node.style, 'fill.hatch_color', color);
  if (background) set(sketch.node.style, 'fill.hatch_background', background);
  if (stroke_width) set(sketch.node.style, 'fill.hatch_stroke_width', stroke_width);
  return sketch;
};
