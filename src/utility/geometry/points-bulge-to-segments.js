const sagitta_arc = require('./sagitta-arc');
const Arc = require('../../entities/geometric/arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Point = require('../../entities/geometric/point.js');


function points_bulge_to_segments(points) {
  return points.slice(1).map((poly_point, i) => {
    // If there is a bulge property, we have an arc
    if (poly_point.bulge) {
      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(points[i].point, poly_point.point, poly_point.bulge);
      return new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw);
    }

    // Otherwise we have a straight segment
    return new Segment(points[i].point, poly_point.point);
  });
}

module.exports = points_bulge_to_segments;
