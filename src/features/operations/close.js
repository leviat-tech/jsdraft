const { base_entity_type } = require('../../utility/misc/entity-type.js');
const Polyface = require('../../entities/geometric/polyface.js');


module.exports = function close(sketch, bulge = 0) {
  for (const s of sketch.tree('level', 'all')) {
    const type = s.node.entity && base_entity_type(s.node.entity);

    if (type === 'polycurve') {
      s.node.entity = new Polyface(s.node.entity, bulge);
    }
  }

  return sketch;
};
