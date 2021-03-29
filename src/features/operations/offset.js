const offset_polyline = require('@crhio/offset').default;
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const arc_to_bulge = require('../../utility/geometry/arc-to-bulge.js');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Polyface = require('../../entities/geometric/polyface.js');


module.exports = function offset(sketch, entity, distance) {
  const type = base_entity_type(entity);
  const vertexes = [];
  const pc_vertices = entity.vertices;

  vertexes.push({ x: pc_vertices[0].x, y: pc_vertices[0].y, bulge: 0 });
  [...entity.edges].forEach((edge, i) => {

    if (!edge.isSegment()) {
      const bulge = arc_to_bulge(
        edge.shape.startAngle,
        edge.shape.endAngle,
        edge.shape.counterClockwise,
      );

      vertexes[vertexes.length - 1].bulge = bulge;
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

  return sketch.add_entities(result);
};
