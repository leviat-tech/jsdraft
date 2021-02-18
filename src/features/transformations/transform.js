const flatten = require('@flatten-js/core');

module.exports = function transform(sketch, m) {
  for (const s of sketch.tree()) {
    s.node.entities = s.node.entities.map(e => e.transform(m))
  }
  return sketch
}
