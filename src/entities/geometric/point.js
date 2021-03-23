const flatten = require('@flatten-js/core');
const { entity_svg } = require('../../utility/misc/entity-to-svg.js');


// Modifying prototype in the event that a user wants to render an
// entity obtained through flatten.js methods.
flatten.Point.prototype.svg = function svg(styles) {
  return entity_svg.point(this, styles);
};

class Point extends flatten.Point {
}


module.exports = Point;
