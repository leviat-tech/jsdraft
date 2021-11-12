const flatten = require('@flatten-js/core');
const { Vector } = require('@crhio/vector');
const { deg_to_rad } = require('../../utility/misc/rad-deg');


module.exports = function rotate(sketch, angle, units = 'deg') {
  if (typeof angle !== 'number') {
    // angle is vector
    const vec = Vector(angle);
    angle = vec.angle();
  } else if (units === 'deg') {
    angle = deg_to_rad(angle);
  }

  return sketch.transform(flatten.matrix().rotate(angle));
};
