const almost_equal = require('../misc/almost-equal.js');


// Determine whether three points are colinear, clockwise, or counterclockwise
function orientation(a, b, c) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const [cx, cy] = c;

  const val = (by - ay) * (cx - bx) - (bx - ax) * (cy - by);
  if (almost_equal(val, 0)) { return 'colinear'; }
  return val > 0 ? 'clockwise' : 'counterclockwise';
}

module.exports = orientation;
