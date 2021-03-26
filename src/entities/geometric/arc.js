const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector').default;
const { normalize, matches } = require('../../utility/arguments');
const circle_from_three_pts = require('../../utility/geometry/circle-from-three-pts.js');
const orientation = require('../../utility/geometry/orientation.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');
const Segment = require('./segment.js');


class Arc extends flatten.Arc {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'number', 'number', 'number', '...')) {
      const [center, radius, start, end, cc] = args;
      return super(flatten.point(...center), radius, start, end, cc);
    }

    if (matches(args, 'point', 'point', 'number', '...')) {
      const [center, start, angle, cc] = args;
      return Arc.from_center_start(center, start, angle, cc);
    }

    if (matches(args, 'point', 'point', 'point')) {
      const [start, through, end] = args;
      return Arc.from_through_point(start, through, end);
    }

    if (matches(args, 'point', 'number', 'point')) {
      const [start, bulge, end] = args;
      return Arc.from_bulge(start, bulge, end);
    }

    if (matches(args, 'segment', 'segment', 'number', '...')) {
      const [tan_a, tab_b, radius, side] = args;
      return Arc.from_tangents(tan_a, tab_b, radius, side);
    }

    throw Error('Unexpected arguments for an Arc constructor.');
  }

  static from_center_radius(center, radius, start, end, cc) {
    [center] = normalize([center]);

    return new Arc(center, radius, start, end, cc);
  }

  static from_center_start(center, start, angle, cc = true) {
    const start_pt = Vector({ x: start[0], y: start[1] });
    const center_pt = Vector({ x: center[0], y: center[1] });
    const radius = start_pt.dist(center_pt);
    const start_angle = start_pt.subtract(center_pt).angle();
    const end_angle = cc ? start_angle + angle : start_angle - angle;
    return new Arc(center, radius, start_angle, end_angle, cc);
  }

  static from_through_point(start, through, end) {
    const { x, y, r } = circle_from_three_pts(start, through, end);
    const start_pt = Vector({ x: start[0], y: start[1] });
    const end_pt = Vector({ x: end[0], y: end[1] });
    const start_angle = start_pt.subtract({ x, y }).angle();
    const end_angle = end_pt.subtract({ x, y }).angle();
    const o = orientation(start, through, end);
    const cc = o === 'counterclockwise';
    return new Arc([x, y], r, start_angle, end_angle, cc);
  }

  static from_bulge(start, bulge, end) {
    const { radius, center, start_angle, end_angle, ccw } = sagitta_arc(start, end, bulge);
    return new Arc(center, radius, start_angle, end_angle, ccw);
  }

  static from_tangents(a, b, radius, cc) {
    [a, b] = [a, b].map((x) => new Segment(x));
    const i = a.intersect(b)[0];
    const va = flatten.vector(i, a.start).normalize();
    const vb = flatten.vector(i, b.start).normalize();
    const bisect = flatten.vector(i, flatten.segment(a.start, b.start).middle()).normalize();
    const theta = Math.acos(va.dot(vb)) / 2.0; // va.angleTo(vb) / 2.0
    const l_tan = radius / Math.tan(theta);
    const hypotenuse = radius / Math.sin(theta);
    const center = i.translate(bisect.multiply(hypotenuse));

    const pt_a = flatten.vector(i.x, i.y).add(va.multiply(l_tan));
    const pt_b = flatten.vector(i.x, i.y).add(vb.multiply(l_tan));
    const start = Math.atan2(pt_a.y, pt_a.x);
    const end = Math.atan2(pt_b.y, pt_b.x);

    return new Arc(center, radius, start, end, cc);
  }
}


module.exports = Arc;
