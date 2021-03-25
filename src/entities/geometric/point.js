const flatten = require('@flatten-js/core');
const svg_string = require('../../utility/misc/svg-string.js');


// Modifying prototype in the event that a user wants to render an
// entity obtained through flatten.js methods.
flatten.Point.prototype.svg = function svg(styles) {
  const attributes = {
    ...styles,
    d: `M${this.x},${this.y} L${this.x},${this.y + 0.0001}`,
    stroke_linecap: 'round',
    stroke_width: '10px',
    vector_effect: 'non-scaling-stroke',
  };

  return svg_string('path', attributes);
};

class Point extends flatten.Point {
}


module.exports = Point;
