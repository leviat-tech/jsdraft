const almost_equal = require('../misc/almost-equal.js');
const arc_to_bulge = require('./arc-to-bulge.js');

// entity can be either a polyface or a polyface
function polycurve_to_vertices(entity, type) {
  const pc_vertices = entity.vertices;

  const vertices = [];

  vertices.push({ x: pc_vertices[0].x, y: pc_vertices[0].y, bulge: 0 });
  [...entity.edges].forEach((edge, i) => {
    const isSegment = typeof edge.isSegment === 'function' ? edge.isSegment() : edge.isSegment;
    if (!isSegment) {
      const arc = edge.shape;

      // circles need special handling
      if (almost_equal(arc.sweep, 2 * Math.PI)) {
        const midpoint = arc.middle();

        vertices[vertices.length - 1].bulge = 1;
        vertices.push({ x: midpoint.x, y: midpoint.y, bulge: 1 });
      // offset lib requires that arc segments be < PI radians in arc length
      } else if (arc.sweep > Math.PI) {
        const bulge = arc_to_bulge(
          arc.startAngle,
          arc.endAngle,
          arc.counterClockwise,
          2,
        );

        const midpoint = arc.middle();

        vertices[vertices.length - 1].bulge = bulge;
        vertices.push({ x: midpoint.x, y: midpoint.y, bulge });
      } else {
        const bulge = arc_to_bulge(
          arc.startAngle,
          arc.endAngle,
          arc.counterClockwise,
        );

        vertices[vertices.length - 1].bulge = bulge;
      }
    }

    if (type === 'polycurve' || i < pc_vertices.length - 1) {
      const vertex = pc_vertices[(i + 1) % pc_vertices.length];
      vertices.push({ x: vertex.x, y: vertex.y, bulge: 0 });
    }
  });

  return vertices;
}

module.exports = polycurve_to_vertices;
