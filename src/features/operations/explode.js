const { base_entity_type } = require('../../utility/misc/entity-type.js');


module.exports = function explode(sketch) {
  const result = [];
  const hidden = [];

  for (const s of sketch.tree('partition')) {
    if (s.node.hidden) {
      hidden.push(s);
      continue;
    } else if (!s.node.entity) {
      continue;
    }

    const entity = s.node.entity;
    const type = base_entity_type(entity);
    if (type === 'polycurve') {
      result.push(...entity.toShapes());
    } else if (type === 'polyface') {
      const edges = [...entity.edges].map((e) => e.shape);
      result.push(...edges);
    } else {
      result.push(entity);
    }
  }

  return sketch.new.add(...hidden, ...result);
};
