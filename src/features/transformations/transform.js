const flatten = require('@flatten-js/core');


module.exports = function transform(sketch, matrix) {
  for (const s of sketch.tree('level', 'all')) {
    // apply transformation to entities
    if (s.node.entity || s.node.mask) {
      if (s.node.entity) s.node.entity = s.node.entity.transform(matrix);
      if (s.node.mask) s.node.mask = s.node.mask.transform(matrix);

      // store transformation matrix
      const m = s.node.transform
        ? (new flatten.Matrix(...s.node.transform)).multiply(matrix)
        : matrix;

      s.node.transform = [m.a, m.b, m.c, m.d, m.tx, m.ty];
    }
  }
  return sketch;
};
