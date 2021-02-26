const almost_equal = require('../misc/almost-equal.js');


// Determine whether three points are colinear, clockwise, or counterclockwise
function orientation(a, b, c) {
  const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y);
  if (almost_equal(val, 0)) { return 'colinear'; }
  return val > 0 ? 'clockwise' : 'counterclockwise';
}

module.exports = orientation;
