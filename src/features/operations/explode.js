const { base_entity_type } = require('../../utility/misc/entity-type.js');


module.exports = function explode(sketch) {
  const result = [];

  for (const entity of sketch.entities()) {
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

  return sketch.new.add_entities(...result);
};
