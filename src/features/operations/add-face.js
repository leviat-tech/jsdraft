// Add a face to a polygon
module.exports = {
  name: 'add_face',
  parameters: [
    { name: 'face', cast: 'polyface' },
  ],
  func: function add_face(sketch, face) {
    const polyface = sketch.shape;

    const f = face.faces.values().next().value;
    polyface.addFace(f);

    return sketch.create({ entities: [polyface] });
  },
};
