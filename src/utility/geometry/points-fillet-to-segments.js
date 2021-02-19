const fillet = require('./fillet.js');
const Segment = require('../../entities/geometric/segment.js');
const Arc = require('../../entities/geometric/arc.js');
const Point = require('../../entities/geometric/point.js');
const sagitta_arc = require('./sagitta-arc.js');


function should_fillet(point_array, index, closed) {
  const point = point_array[index];

  if (closed) {
    return point.fillet;
  }

  return point.fillet
    && point_array[index + 1]
    && point_array[index - 1];
}

function points_fillet_to_segments(points, closed) {
  const segments = [];

  points.slice(1).forEach((pline_pt, i) => {
    if (should_fillet(points, i + 1, closed)) {
      const fc = fillet(
        points[i].point,
        pline_pt.point,
        points[(i + 2) % points.length].point,
        pline_pt.fillet,
      );

      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(points[i].point, pline_pt.point, fc.bulge);

      segments.push(
        new Segment(fc.point_a, fc.point_b),
        new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw),
      );
    } else {
      segments.push(new Segment(points[i].point, pline_pt.point));
    }
  });

  if (closed) {
    if (points[0].fillet) {
      const fc = fillet(
        points[points.length - 1].point,
        points[0].point,
        points[1].point,
      );

      const last_pt = segments[segments.length - 1].pe;

      segments[0] = new Segment(fc.point_b, segments[0].pe);
      segments.push(new Segment(last_pt, fc.point_a));

      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(fc.point_a, fc.point_b, fc.bulge);

      segments.push(new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw));
    }
  }

  return segments;
}

module.exports = points_fillet_to_segments;
