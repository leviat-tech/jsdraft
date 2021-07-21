const offset_polyline = require('@crhio/offset').default;
const flatten = require('@flatten-js/core');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const polycurve_to_vertices = require('../../utility/geometry/polycurve-to-vertices.js');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Polyface = require('../../entities/geometric/polyface.js');
const assert = require('../../utility/validation/assert.js');


function can_offset(entity) {
  return entity instanceof flatten.Multiline
    || entity instanceof flatten.Polygon;
}

module.exports = function offset(sketch, distance, sharp_corners = true) {
  distance = assert(distance, 'number');

  if (distance === 0) return sketch;

  for (const s of sketch.tree('level')) {
    let entity = s.node.entity;
    if (!entity) continue;
    const type = base_entity_type(entity);
    if (!['segment', 'arc', 'polycurve', 'polyface'].includes(type)) continue;
    if (['segment', 'arc'].includes(type)) entity = new Polycurve(entity);
    if (!can_offset(entity)) throw new Error(`Cannot offset entity of type "${type}"`);

    const pline = {
      vertexes: polycurve_to_vertices(entity, type),
      isClosed: type === 'polyface',
    };

    const offset_pline = offset_polyline(pline, distance, sharp_corners);

    if (!offset_pline[0]) continue;

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

    s.node.entity = result;
  }

  return sketch;
};
