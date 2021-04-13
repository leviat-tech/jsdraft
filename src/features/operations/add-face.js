const { base_entity_type } = require('../../utility/misc/entity-type.js');


// Add faces to other polyfaces
module.exports = {
  name: 'add_face',
  parameters: [
    { name: 'faces', cast: 'sketch' },
  ],
  func: function add_face(sketch, adding_sketch) {
    const faces = adding_sketch.polyfaces
      .map((pf) => pf.faces.values().next().value);

    const result = [];

    for (const entity of sketch.entities) {
      const type = base_entity_type(entity);
      if (type === 'polyface') {
        faces.forEach((face) => entity.addFace(face));
        result.push(entity);
      } else {
        result.push(entity);
      }
    }

    return sketch.new.add(...result);
  },
};
