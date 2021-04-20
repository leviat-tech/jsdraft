const flatten = require('@flatten-js/core');
const fillet_pts = require('./fillet.js');
const Arc = require('../../entities/geometric/arc.js');


function fillet_edges(entity, radius, index) {
  let i = 0;
  for (const edge of entity) {
    const should_fillet = (index === undefined || index === i)
      && radius > 0
      && edge.isSegment()
      && !!edge.next
      && edge.next.isSegment();

    if (should_fillet) {
      const a = edge.shape.ps;
      const p = edge.shape.pe;
      const b = edge.next.shape.pe;

      const {
        point_a,
        point_b,
        bulge,
      } = fillet_pts([a.x, a.y], [p.x, p.y], [b.x, b.y], radius);

      edge.shape.pe = new flatten.Point(point_a[0], point_a[1]);
      edge.next.shape.ps = new flatten.Point(point_b[0], point_b[1]);
      const arc = new Arc(point_a, bulge, point_b);

      entity.insert(new flatten.Edge(arc), edge);
    }

    i += 1;
  }

  return entity;
}

module.exports = fillet_edges;
