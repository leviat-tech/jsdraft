const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector').default;
const { deg_to_rad } = require('../../utility/misc/rad-deg');


module.exports = function rotate(sketch, angle, units = 'deg') {
  if (typeof angle === 'number') {
    if (units === 'deg') {
      angle = deg_to_rad(angle);
    }
  } else {
    // angle is vector
    let vec;
    if (Array.isArray(angle)) {
      vec = Vector({ x: angle[0], y: angle[1] });
    } else {
      vec = Vector({ x: angle.x, y: angle.y });
    }

    angle = vec.angle;
  }

  return sketch.transform(flatten.matrix().rotate(angle));
};
