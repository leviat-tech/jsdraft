const flatten = require('@flatten-js/core');
const { normalize, every } = require('../../utility/arguments');
const { matches_segment_array } = require('../../utility/arguments/matches.js');
const sagitta_arc = require('../../utility/geometry/sagitta-arc.js');
const fillet_points_to_segments = require('../../utility/geometry/fillet-points-to-segments.js');
const Arc = require('./arc.js');
const Segment = require('./segment.js');
const svg_string = require('../../utility/misc/svg-string');


// Modifying prototype in the event that a user wants to render an
// entity obtained through flatten.js methods.
flatten.Multiline.prototype.svg = function svg(styles) {
  let d = `M${this.first.start.x},${this.first.start.y}`;
  for (const edge of this) { d += edge.svg(); }

  const attributes = {
    ...styles,
    d,
  };

  return svg_string('path', attributes);
};

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
    const segs = fillet_points_to_segments(points);

    return new Polycurve(...segs);
  }

  static from_bulge(...args) {
    // Bulge args at the beginning or end will be ignored
    if (!is_point(args[0])) args.shift();
    if (!is_point(args[args.length - 1])) args.pop();

    // first put args into point/bulge pairs
    const points = [];
    let adding_bulge = false;
    args.forEach((arg) => {
      // arg is a point
      if (is_point(arg)) {
        if (adding_bulge) {
          points[points.length - 1].point = arg;
          adding_bulge = false;
        } else {
          points.push({ point: arg });
        }

      // arg is a bulge
      } else {
        points.push({ bulge: arg });
        adding_bulge = true;
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
