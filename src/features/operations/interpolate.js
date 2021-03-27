const flatten = require('@flatten-js/core');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Segment = require('../../entities/geometric/segment.js');


module.exports = {
  name: 'interpolate',
  parameters: [
    { name: 'pcurve', cast: 'polycurve' },
    { name: 'pt_a', cast: 'point' },
    { name: 'pt_b', cast: 'point' },
    { name: 'positions', type: 'array' },
  ],
  func: function interpolate(sketch, pcurve, pt_a, pt_b, positions) {
    const vec_a = new flatten.Vector([pt_a.x, pt_a.y]);
    const vec_b = new flatten.Vector([pt_b.x, pt_b.y]);
    const dir = vec_b.subtract(vec_a).normalize();

    const angle = Math.atan2(dir.y, dir.x);

    const oriented = pcurve
      .transform(flatten.matrix().rotate(angle).translate(pt_a.x, pt_a.y));

    const positioned = positions
      .sort((a, b) => a - b)
      .map((position) => {
        const translation = dir.multiply(position);
        return oriented.transform(flatten.matrix().translate(translation.x, translation.y));
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

    const new_pcurve = new Polycurve(...segs);

    return sketch.add_entities(new_pcurve);
  },
};
