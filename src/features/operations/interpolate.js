const flatten = require('@flatten-js/core');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Segment = require('../../entities/geometric/segment.js');


module.exports = function interpolate(sketch, block, pt_a, pt_b, positions) {
  const vec_a = new flatten.Vector(pt_a);
  const vec_b = new flatten.Vector(pt_b);
  const dir = vec_b.subtract(vec_a).normalize();

  const angle = Math.atan2(dir.y, dir.x);

  const oriented = block
    .rotate(angle, 'radians')
    .translate(...pt_a);

  const positioned = positions
    .sort((a, b) => a - b)
    .map((position) => {
      const translation = dir.multiply(position);
      return oriented.translate(translation.x, translation.y).shape;
    });

  const segs = [new Segment(pt_a, positioned[0].vertices[0])];

  positioned.slice(0, -1).forEach((c, i) => {
    const next = positioned[i + 1];
    const connector = new Segment(c.vertices[c.vertices.length - 1], next.vertices[0]);
    segs.push(...c.toShapes(), connector);
  });

  const last = positioned[positioned.length - 1];
  const last_seg = new Segment(last.vertices[last.vertices.length - 1], pt_b);
  segs.push(...last.toShapes(), last_seg);

  const pcurve = new Polycurve(...segs);

  return sketch.add_entities(pcurve);
};
