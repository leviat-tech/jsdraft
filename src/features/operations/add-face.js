// Add a face to a polygon
module.exports = function add_face(sketch, face) {
  const polyface = sketch.shape;

  const f = face.shape.faces.values().next().value;
  polyface.addFace(f);

  return sketch.create({ entities: [polyface] });
};
