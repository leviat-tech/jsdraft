const almost_equal = require('../misc/almost-equal.js');


module.exports = function split_segment(segment, intersections) {
  const ordered_intersections = intersections
    // Find arc length for each intersection
    .map((pt) => {
      const shapes = segment.split(pt);

      let len;
      if (shapes[0] === null) { // point incident to edge start
        len = 0;
      } else if (shapes[1] === null) { // point incident to edge end
        len = segment.length;
      } else { // edge split into two edges
        len = shapes[0].length;
      }

      let is_vertex = 0;
      if (almost_equal(len, 0)) {
        is_vertex |= 1;
      }
      if (almost_equal(len, segment.length)) {
        is_vertex |= 2;
      }

      const arc_length = (is_vertex & 2) ? 0 : len;

      return { arc_length, pt, shapes };
    })

    // Sort intersections along length of polycurve
    .sort((a, b) => {
      if (a.arc_length < b.arc_length) return -1;
      if (a.arc_length > b.arc_length) return 1;
      return 0;
    });

  return ordered_intersections.reduce((segs, intersection) => {
    const shapes = segs[segs.length - 1].split(intersection.pt);

    if (shapes[0] !== null && shapes[1] !== null) {
      segs.pop();
      segs.push(...shapes);
    }

    return segs;
  }, [segment]);
};
