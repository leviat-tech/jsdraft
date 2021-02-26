const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector');
const { normalize, matches } = require('../../utility/arguments.js');
const circle_from_three_pts = require('../../utility/geometry/circle-from-three-pts.js');
const orientation = require('../../utility/geometry/orientation.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');
const fillet = require('../../utility/geometry/fillet.js');


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

    if (matches('segment', 'segment', 'number', '...')) {
      const [tan_a, tab_b, radius, side] = args;
      return Arc.from_tangents(tan_a, tab_b, radius, side);
    }
  }

  static from_center_radius(center, radius, start, end, cc) {
    return new Arc(center, radius, start, end, cc);
  }

  static from_center_start(center, start, angle, cc = true) {
    const start_pt = Vector(start);
    const center_pt = Vector(center);
    const radius = start_pt.dist(center_pt);
    const start_angle = start_pt.subtract(center_pt).angle();
    const end_angle = cc ? start_angle + angle : start_angle - angle;
    return new Arc(center, radius, start_angle, end_angle, cc);
  }

  static from_through_point(start, through, end) {
    const { x, y, r } = circle_from_three_pts(start, through, end);
    const start_pt = Vector(start);
    const end_pt = Vector(end);
    const start_angle = start_pt.angle();
    const end_angle = end_pt.angle();
    const o = orientation(start, through, end);
    const cc = o === 'counterclockwise';
    return new Arc([x, y], r, start_angle, end_angle, cc);
  }

  static from_bulge(start, bulge, end) {
    const { radius, center, start_angle, end_angle, ccw } = sagitta_arc(start, end, bulge);
    return new Arc(center, radius, start_angle, end_angle, ccw);
  }

  static from_tangents(tan_a, tan_b, radius, side) {
    const line_a = flatten.Line(tan_a.ps, tan_a.pe);
    const line_b = flatten.Line(tan_b.ps, tan_b.pe);
    const intersections = line_a.intersect(line_b);
    const i = intersections[0];
    if (!i) throw new Error('Lines are parallel');
    const ta_s = Vector(tan_a.ps);
    const ta_e = Vector(tan_a.pe);
    const tb_s = Vector(tan_b.ps);
    const tb_e = Vector(tan_b.pe);
    const ta_s_dsq = ta_s.distSq(i);
    const ta_e_dsq = ta_e.distSq(i);
    const tb_s_dsq = tb_s.distSq(i);
    const tb_e_dsq = tb_e.distSq(i);
    const a = ta_s_dsq > ta_e_dsq ? ta_s : ta_e;
    const b = tb_s_dsq > tb_e_dsq ? tb_s : tb_e;

    const { point_a, point_b, bulge } = fillet(a, i, b, radius);
    // TODO: select proper arc seg depending on side prop
    return new Arc(point_a, bulge, point_b);
  }

}


module.exports = Arc;
