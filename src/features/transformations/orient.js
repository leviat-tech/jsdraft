const flatten = require('@flatten-js/core');
const { Vector } = require('@crhio/vector');


module.exports = {
  name: 'orient',
  parameters: [
    { name: 'origin', cast: 'point' },
    { name: 'point', cast: 'point' },
    { name: 'target_origin', cast: 'point' },
    { name: 'target_point', cast: 'point' },
  ],
  func: function orient(sketch, origin, point, target_origin, target_point) {
    const translation = Vector(target_origin).subtract(origin);
    const vec_initial = Vector(point).subtract(origin);
    const vec_target = Vector(target_point).subtract(target_origin);
    const angle_initial = vec_initial.angle();
    const angle_target = vec_target.angle();
    const angle = angle_target - angle_initial;

    return sketch
      .transform(flatten.matrix().rotate(angle))
      .transform(flatten.matrix().translate(translation.x, translation.y));
  },
};
