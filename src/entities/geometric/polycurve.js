const flatten = require('@flatten-js/core');
const { normalize, every } = require('../../utility/arguments');
const { matches_segment_array, matches_fillet_point } = require('../../utility/arguments/matches.js');
const fillet_points_to_segments = require('../../utility/geometry/fillet-points-to-segments.js');
const Arc = require('./arc.js');
const Segment = require('./segment.js');
const { numeric_array } = require('../../utility/arguments/numeric');


// Monkey patch flatten.Multiline to add type property
Object.defineProperty(flatten.Multiline.prototype, 'type', {
  get() { return 'polycurve'; },
});

class Polycurve extends flatten.Multiline {
  constructor(...args) {
    args = normalize(args);

    if (every(args, 'point or number or fillet_pt')) {
      return Polycurve.from_points(...args);
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

  static from_points(...args) {
    const points = [];
    let adding_bulge = false;
    args.forEach((arg) => {

      // arg is a fillet point
      if (matches_fillet_point(arg)) {
        points.push({ point: arg[0], fillet: arg[1] });

      // arg is a point
      } else if (numeric_array(arg, { eq: 2 })) {
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

    const segs = fillet_points_to_segments(points);

    return new Polycurve(...segs);
  }

  static from_segments(...segs) {
    return new Polycurve(...segs);
  }
}


module.exports = Polycurve;
