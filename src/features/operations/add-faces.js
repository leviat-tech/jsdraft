const { base_entity_type } = require('../../utility/misc/entity-type.js');


// Add faces to other polyfaces
module.exports = {
  name: 'add_faces',
  parameters: [
    { name: 'faces', cast: 'sketch' },
  ],
  func: function add_faces(sketch, adding_sketch) {
    const faces = adding_sketch.polyfaces
      .map((pf) => pf.faces.values().next().value);

    for (const s of sketch.tree('level')) {
      if (s.node.entity && base_entity_type(s.node.entity) === 'polyface') {
        faces.forEach((face) => { s.node.entity.addFace(face); });
      }
    }

    return sketch;
  },
};
