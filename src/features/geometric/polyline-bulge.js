const Arc = require('../../entities/geometric/arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Polyline = require('../../entities/geometric/polyline.js');
const Point = require('../../entities/geometric/point.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');
const is_object = require('../../utility/misc/is-object.js');


module.exports = function polyline_bulge(sketch, ...args) {
  /*
  Args are an array of points that can look like:
  [
    { point, bulge },
    { point },
    point,
    [[1, 2], 3],
    [1, 2],
    [1, 2, 3],
  ]
  */
  const points = args.map((a) => {
    if (is_object(a) && a.point) return { point: a.point, bulge: a.bulge || 0 };

    if (is_object(a) && a.x && a.y) return { point: a, bulge: 0 };

    if (Array.isArray(a) && Array.isArray(a[0])) {
      return { point: new Point(...a[0]), bulge: a[1] || 0 };
    }

    if (Array.isArray(a) && typeof a[0] === 'number') return { point: new Point(...a) };

    throw new Error('Input is not an array of points w/ bulge');
  });

  const segments = points.slice(1).map((point, i) => {
    // If there is a bulge property, we have an arc
    if (point.bulge) {
      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(points[i].point, point.point, point.bulge);
      return new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw);
    }

    // Otherwise we have a straight segment
    return new Segment(points[i].point, point.point);
  });

  return sketch.create({
    entities: [new Polyline(segments)],
  });
};
