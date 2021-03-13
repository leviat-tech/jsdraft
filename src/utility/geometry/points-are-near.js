const flatten = require('@flatten-js/core');
const almost_equal = require('../misc/almost-equal.js');


function points_are_near(point_a, point_b) {
  const [xa, ya] = point_a instanceof flatten.Point
    ? [point_a.x, point_a.y]
    : [...point_a];

  const [xb, yb] = point_b instanceof flatten.Point
    ? [point_b.x, point_b.y]
    : [...point_b];

  return almost_equal(xa, xb) && almost_equal(ya, yb);
}

module.exports = points_are_near;
