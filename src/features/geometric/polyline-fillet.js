const Polyline = require('../../entities/geometric/polyline.js');
const Arc = require('../../entities/geometric/arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Point = require('../../entities/geometric/point.js');
const is_object = require('../../utility/misc/is-object.js');
const fillet = require('../../utility/geometry/fillet.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');


function should_fillet(point_array, index) {
  const point = point_array[index];

  return point.fillet
    && point_array[index + 1]
    && point_array[index - 1];
}

module.exports = function polyline_fillet(sketch, ...args) {
  /*
  Args are an array of points that can look like:
  [
    { point, fillet },
    { point },
    point,
    [[1, 2], 3],
    [1, 2],
    [1, 2, 3],
  ]
  */

  const points = args.map((a) => {
    if (is_object(a) && a.point) return { point: a.point, fillet: a.fillet || 0 };

    if (is_object(a) && a.x && a.y) return { point: a, fillet: 0 };

    if (Array.isArray(a) && Array.isArray(a[0])) {
      return { point: new Point(...a[0]), fillet: a[1] || 0 };
    }

    if (Array.isArray(a) && typeof a[0] === 'number') return { point: new Point(...a) };

    throw new Error('Input is not an array of points w/ bulge');
  });

  const segments = [];
  let pen = points[0].point;
  points.slice(1).forEach((pline_pt, i) => {
    if (should_fillet(points, i + 1)) {
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
      } = sagitta_arc(fc.point_a, fc.point_b, fc.bulge);

      segments.push(
        new Segment(pen, fc.point_a),
        new Arc(new Point(center.x, center.y), radius, start_angle, end_angle, ccw),
      );
      pen = fc.point_b;
    } else {
      segments.push(new Segment(pen, pline_pt.point));
      pen = pline_pt.point;
    }
  });

  return sketch.create({
    entities: [new Polyline(segments)],
  });
};
