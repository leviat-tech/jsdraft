const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector').default;
const { normalize, matches } = require('../../utility/arguments');
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

    throw Error('Unexpected arguments for an Arc constructor.');
  }

  static from_center_radius(center, radius, start, end, cc) {
    [center] = normalize([center]);

    return new Arc(center, radius, start, end, cc);
  }

  static from_center_start(center, start, angle, cc = true) {
    [center, start] = normalize([center, start]);

    const start_pt = Vector({ x: start[0], y: start[1] });
    const center_pt = Vector({ x: center[0], y: center[1] });
    const radius = start_pt.dist(center_pt);
    const start_angle = start_pt.subtract(center_pt).angle();
    const end_angle = cc ? start_angle + angle : start_angle - angle;
    return new Arc(center, radius, start_angle, end_angle, cc);
  }

  static from_through_point(start, through, end) {
    [start, through, end] = normalize([start, through, end]);

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
    [start, end] = normalize([start, end]);

    const { radius, center, start_angle, end_angle, ccw } = sagitta_arc(start, end, bulge);
    return new Arc(center, radius, start_angle, end_angle, ccw);
  }

  static from_tangents(tan_a, tan_b, radius, side) {
    [tan_a, tan_b] = normalize([tan_a, tan_b]);

    const line_a = flatten.Line(tan_a[0], tan_a[1]);
    const line_b = flatten.Line(tan_b[0], tan_b[1]);
    const intersections = line_a.intersect(line_b);
    const i = intersections[0];
    if (!i) throw new Error('Lines are parallel');
    const ta_s = Vector({ x: tan_a[0][0], y: tan_a[0][1] });
    const ta_e = Vector({ x: tan_a[1][0], y: tan_a[1][1] });
    const tb_s = Vector({ x: tan_b[0][0], y: tan_b[0][1] });
    const tb_e = Vector({ x: tan_b[1][0], y: tan_b[1][1] });
    const ta_s_dsq = ta_s.distSq(i);
    const ta_e_dsq = ta_e.distSq(i);
    const tb_s_dsq = tb_s.distSq(i);
    const tb_e_dsq = tb_e.distSq(i);
    const a = ta_s_dsq > ta_e_dsq ? ta_s : ta_e;
    const b = tb_s_dsq > tb_e_dsq ? tb_s : tb_e;


    const { point_a, point_b, bulge } = fillet(a, i, b, radius);
    console.log('a', point_a, 'b', point_b, 'bulge', bulge);
    // TODO: select proper arc seg depending on side prop
    return new Arc(point_a, bulge, point_b);
  }
}


module.exports = Arc;
