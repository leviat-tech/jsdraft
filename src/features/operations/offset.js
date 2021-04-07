const offset_polyline = require('@crhio/offset').default;
const flatten = require('@flatten-js/core');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const arc_to_bulge = require('../../utility/geometry/arc-to-bulge.js');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Polyface = require('../../entities/geometric/polyface.js');
const almost_equal = require('../../utility/misc/almost-equal.js');


function can_offset(entity) {
  return entity instanceof flatten.Multiline
    || entity instanceof flatten.Polygon;
}

// Possible arguments:
// sketch.offset(distance)
// sketch.offset(entity, distance)
module.exports = function offset(sketch, ...args) {
  let entity;
  let distance;

  if (typeof args[0] === 'number') {
    entity = sketch.shape;
    distance = args[0];
  } else {
    entity = args[0];
    distance = args[1];
  }

  const type = base_entity_type(entity);
  const vertexes = [];
  const pc_vertices = entity.vertices;

  if (['segment', 'arc'].includes(type)) entity = new Polycurve(entity);

  if (!can_offset(entity)) throw new Error(`Cannot offset entity of type "${type}"`);

  vertexes.push({ x: pc_vertices[0].x, y: pc_vertices[0].y, bulge: 0 });
  [...entity.edges].forEach((edge, i) => {

    if (!edge.isSegment()) {
      const arc = edge.shape;

      // circles need special handling
      if (almost_equal(arc.sweep, 2 * Math.PI)) {
        const midpoint = arc.middle();

        vertexes[vertexes.length - 1].bulge = 1;
        vertexes.push({ x: midpoint.x, y: midpoint.y, bulge: 1 });
      // offset lib requires that arc segments be < PI radians in arc length
      } else if (arc.sweep > Math.PI) {
        const bulge = arc_to_bulge(
          arc.startAngle,
          arc.endAngle,
          arc.counterClockwise,
          2,
        );

        const midpoint = arc.middle();

        vertexes[vertexes.length - 1].bulge = bulge;
        vertexes.push({ x: midpoint.x, y: midpoint.y, bulge });
      } else {
        const bulge = arc_to_bulge(
          arc.startAngle,
          arc.endAngle,
          arc.counterClockwise,
        );

        vertexes[vertexes.length - 1].bulge = bulge;
      }
    }

    if (type === 'polycurve' || i < pc_vertices.length - 1) {
      const vertex = pc_vertices[(i + 1) % pc_vertices.length];
      vertexes.push({ x: vertex.x, y: vertex.y, bulge: 0 });
    }
  });

  const pline = {
    vertexes,
    isClosed: type === 'polyface',
  };

  const offset_pline = offset_polyline(pline, distance);

  const pcurve_args = [];
  offset_pline[0].vertexes.forEach((vertex) => {
    pcurve_args.push([vertex.x, vertex.y]);
    if (vertex.bulge) pcurve_args.push(vertex.bulge);
  });

  let result;
  if (type === 'polycurve') {
    result = new Polycurve(...pcurve_args);
  } else {
    result = new Polyface(...pcurve_args);
  }

  return sketch.add(result);
};
