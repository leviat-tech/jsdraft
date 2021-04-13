const flatten = require('@flatten-js/core');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const assert = require('../../utility/validation/assert.js');


module.exports = function subtract(sketch, to_subtract) {
  to_subtract = assert(to_subtract, 'sketch', sketch);

  const faces = to_subtract.polyfaces;

  for (const s of sketch.tree('level')) {
    const type = s.node.entity && base_entity_type(s.node.entity);
    if (type === 'polyface') {
      let shape = s.node.entity;
      faces.forEach((face) => {
        shape = flatten.BooleanOperations.subtract(shape, face);
      });
      s.node.entity = shape;
    }
  }

  return sketch;
};
