module.exports = function polyface_orientation(polyface) {
  let max_area = 0;
  let largest_face;
  for (const face of polyface.faces) {
    const area = face.area();
    if (area > max_area) {
      max_area = area;
      largest_face = face;
    }
  }

  return largest_face.orientation();
};
