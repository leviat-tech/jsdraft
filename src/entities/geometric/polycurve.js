const flatten = require('@flatten-js/core');
const { normalize, every } = require('../../utility/arguments');
const { matches_segment_array } = require('../../utility/arguments/matches.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');
const fillet = require('../../utility/geometry/fillet.js');
const Arc = require('./arc.js');
const Segment = require('./segment.js');


function should_fillet(point_array, index) {
  const point = point_array[index];

  return point[1]
    && point_array[index + 1]
    && point_array[index - 1];
}

function is_point(arg) {
  return Array.isArray(arg);
}

class Polycurve extends flatten.Multiline {
  constructor(...args) {
    args = normalize(args);

    if (every(args, ['point', 'number'])) {
      return Polycurve.from_fillet(...args);
    }

    if (every(args, 'point or number')) {
      return Polycurve.from_bulge(...args);
    }

    if (every(args, 'segment or arc')) {
      const segs = args.map((arg) => {
        if (arg instanceof flatten.Arc || arg instanceof flatten.Segment) return arg;

        if (matches_segment_array(arg)) return new Segment(...arg);

        return new Arc(...arg);
      });

      return super(segs);
    }

    throw new Error('Unexpected arguments for a Polycurve constructor.');
  }

  static from_fillet(...points) {
    const segs = [];
    let pen = points[0][0];
    points.slice(1).forEach((point, i) => {
      if (should_fillet(points, i + 1)) {
        const fc = fillet(
          points[i][0],
          point[0],
          points[(i + 2) % points.length][0],
          point[1],
        );

        const {
          radius,
          center,
          start_angle,
          end_angle,
          ccw,
        } = sagitta_arc(fc.point_a, fc.point_b, fc.bulge);

        segs.push(
          new Segment(pen, fc.point_a),
          new Arc(center, radius, start_angle, end_angle, ccw),
        );
        pen = fc.point_b;
      } else {
        segs.push(new Segment(pen, point[0]));
        pen = point[0];
      }
    });

    return new Polycurve(...segs);
  }

  static from_bulge(...args) {
    // Bulge args at the beginning or end will be ignored
    if (!is_point(args[0])) args.shift();
    if (!is_point(args[args.length - 1])) args.pop();

    // first put args into point/bulge pairs
    const points = [];
    args.forEach((arg) => {
      // arg is a point
      if (is_point(arg)) {
        points.push({ point: arg });

      // arg is a bulge
      } else {
        points[points.length - 1].bulge = arg;
      }
    });

    // Convert point list to segments
    const segs = points.slice(1).map((point, i) => {
      // If there is a bulge property, we have an arc
      if (point.bulge) {
        const {
          radius,
          center,
          start_angle,
          end_angle,
          ccw,
        } = sagitta_arc(points[i].point, point.point, point.bulge);
        return new Arc(center, radius, start_angle, end_angle, ccw);
      }

      // Otherwise we have a straight segment
      return new Segment(points[i].point, point.point);
    });


    return new Polycurve(...segs);
  }

  static from_segments(...segs) {
    return new Polycurve(...segs);
  }
}


module.exports = Polycurve;
