const Multiline = require('../../entities/geometric/multiline.js');
const Arc = require('../../entities/geometric/arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Polygon = require('../../entities/geometric/polygon.js');
const Point = require('../../entities/geometric/point.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');


module.exports = function polycurve(sketch, poly_points, closed) {
  const segments = poly_points.slice(1).map((poly_point, i) => {
    // If there is a bulge property, we have an arc
    if (poly_point.bulge) {
      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(poly_points[i].point, poly_point.point, poly_point.bulge);
      return new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw);
    }

    // Otherwise we have a straight segment
    return new Segment(poly_points[i].point, poly_point.point);
  });

  // If closed, return Polygon
  if (closed) {
    return sketch.create({
      entities: [new Polygon(segments)],
    });
  }

  // If open, return Multiline
  return sketch.create({
    entities: [new Multiline(segments)],
  });
};
