const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector').default;


module.exports = {
  name: 'orient',
  parameters: [
    { name: 'origin', cast: 'point' },
    { name: 'point', cast: 'point' },
  ],
  func: function orient(sketch, origin, point) {
    const vec = Vector(point).subtract(origin);
    const angle = vec.angle();

    return sketch
      .transform(flatten.matrix().rotate(angle))
      .transform(flatten.matrix().translate(origin.x, origin.y));
  },
};
