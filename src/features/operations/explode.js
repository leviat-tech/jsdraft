const { base_entity_type } = require('../../utility/misc/entity-type.js');


module.exports = function explode(sketch) {
  const result = [];
  const hidden = sketch.new.add(...sketch.hidden.entities).hide();

  for (const entity of sketch.shapes()) {
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

  if (hidden.node.children.length > 0) {
    return sketch.new.add(hidden, ...result);
  }

  return sketch.new.add(...result);
};
