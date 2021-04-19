const flatten = require('@flatten-js/core');


module.exports = function union(sketch, ...args) {
  const polyfaces = [].concat(...args.map((a) => a.polyfaces || [a]));
  for (const s of sketch.tree('level')) {
    if (s.node.entity instanceof flatten.Polygon) {
      const faces = [s.node.entity].concat(polyfaces);
      s.node.entity = faces.reduce((a, b) => flatten.BooleanOperations.unify(a, b));
    }
  }
  return sketch;
};
