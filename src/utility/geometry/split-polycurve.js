const almost_equal = require('../misc/almost-equal.js');
const Polycurve = require('../../entities/geometric/polycurve.js');


module.exports = function split_polycurve(polycurve, intersections) {
  const ordered_intersections = intersections
    // Find edge and arc length for each intersection
    .map((pt) => {
      let edge;
      let edge_index;

      let i = 0;
      for (const e of polycurve) {
        if (e.shape.contains(pt)) {
          edge = e;
          edge_index = i;
          break;
        }
        i += 1;
      }

      const shapes = edge.shape.split(pt);

      let len;
      if (shapes[0] === null) { // point incident to edge start
        len = 0;
      } else if (shapes[1] === null) { // point incident to edge end
        len = edge.shape.length;
      } else { // edge split into two edges
        len = shapes[0].length;
      }

      let is_vertex = 0;
      if (almost_equal(len, 0)) {
        is_vertex |= 1;
      }
      if (almost_equal(len, edge.shape.length)) {
        is_vertex |= 2;
      }

      // Fix intersection point which is end point of the last edge
      const arc_length = (is_vertex & 2) && edge.next.arc_length === 0
        ? 0
        : edge.arc_length + len;

      return { edge, edge_index, pt, arc_length, shapes };
    })

    // Sort intersections along length of polycurve
    .sort((a, b) => {
      if (a.edge_index < b.edge_index) return -1;
      if (a.edge_index > b.edge_index) return 1;
      if (a.arc_length < b.arc_length) return -1;
      if (a.arc_length > b.arc_length) return 1;
      return 0;
    })

    // Remove duplicates
    .filter((int, i, arr) => {
      const prev = arr[i - 1];
      return i > 0
        ? (prev.edge_index !== int.edge_index || prev.arc_length !== int.arc_length)
        : true;
    })

    // Fix segments for cases where multiple intersections are on a segment
    .map((intersection, i, arr) => {
      const prev = arr[i - 1];

      if (!prev) return intersection;

      if (intersection.edge_index === prev.edge_index) {
        intersection.shapes = prev.shapes[1].split(intersection.pt);
      }

      return intersection;
    });

  const edges = polycurve.toShapes();
  return ordered_intersections.reduce((segs, intersection) => {
    const edge = segs[intersection.edge_index];
    const shapes = edge[edge.length - 1].split(intersection.pt);

    if (shapes[0] !== null && shapes[1] !== null) {
      edge.pop();
      edge.push(...shapes);
    }

    return segs;
  }, edges.map((e) => ([e]))).flat();
};
