module.exports = function transform(sketch, m) {
  for (const s of sketch.tree('level', 'all')) {
    if (s.node.entity) s.node.entity = s.node.entity.transform(m);
  }
  return sketch;
};
