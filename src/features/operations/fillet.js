const { base_entity_type } = require('../../utility/misc/entity-type.js');
const fillet_edges = require('../../utility/geometry/fillet-edges.js');
const assert = require('../../utility/validation/assert.js');


module.exports = function fillet(sketch, radius, index) {
  assert(radius, 'number');

  for (const s of sketch.tree('level', 'all')) {
    const type = s.node.entity && base_entity_type(s.node.entity);
    if (type === 'polycurve') {
      s.node.entity = fillet_edges(s.node.entity, radius, index);
    } else if (type === 'polyface') {
      const faces = [];
      for (const face of s.node.entity.faces) {
        faces.push(fillet_edges(face, radius, index));
        s.node.entity.deleteFace(face);
      }
      faces.forEach((face) => { s.node.entity.addFace(face); });
    }
  }

  return sketch;
};
