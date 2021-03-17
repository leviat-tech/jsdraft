const flatten = require('@flatten-js/core');
const Arc = require('../../entities/geometric/arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Polycurve = require('../../entities/geometric/polycurve.js');
const fillet_pts = require('../../utility/geometry/fillet.js');


module.exports = function fillet(sketch, radius, pcurve_a, pcurve_b) {
  const a0 = pcurve_a.vertices[pcurve_a.vertices.length - 2];
  const a1 = pcurve_a.vertices[pcurve_a.vertices.length - 1];
  const a_dir = new flatten.Vector(a0, a1).normalize();
  const b0 = pcurve_b.vertices[1];
  const b1 = pcurve_b.vertices[0];
  const b_dir = new flatten.Vector(b0, b1).normalize();
  const dx = b0.x - a0.x;
  const dy = b0.y - a0.y;
  const det = b_dir.x * a_dir.y - b_dir.y * a_dir.x;
  const u = (dy * b_dir.x - dx * b_dir.y) / det;
  const p = new flatten.Vector([a0.x, a0.y])
    .add(a_dir.multiply(u));

  const {
    point_a,
    point_b,
    bulge,
  } = fillet_pts([a0.x, a0.y], [p.x, p.y], [b0.x, b0.y], radius);

  const arc = new Arc(point_a, bulge, point_b);
  const a = pcurve_a.toShapes().slice(0, -1);
  const b = pcurve_b.toShapes().slice(1);
  const seg_a = new Segment(a0, point_a);
  const seg_b = new Segment(point_b, b0);
  const joined_pline = new Polycurve(...a, seg_a, arc, seg_b, ...b);

  return sketch.add(sketch.create({ entities: [joined_pline] }));
};
