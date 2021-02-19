const math = require('mathjs');
const flatten = require('@flatten-js/core');
const is_object = require('../../utility/misc/is-object.js');
const Point = require('./point.js');
const Segment = require('./segment.js');
const points_bulge_to_segments = require('../../utility/geometry/points-bulge-to-segments.js');
const points_fillet_to_segments = require('../../utility/geometry/points-fillet-to-segments.js');


class Polyline extends flatten.Multiline {
  constructor(...args) {
    let segments;

    if (args[0] instanceof Point) {
      /*
      An array of points, like
      [
        point,
        point
      ]
      */

      segments = args.slice(1).map((point, i) => new Segment(args[i], point));
    } else if (is_object(args[0]) && args[0].point && args[0].bulge !== undefined) {
      /*
      An array of point/bulge pairs, like
      [
        { point, bulge },
        { point, bulge },
      ]
      */

      segments = points_bulge_to_segments(args);
    } else if (is_object(args[0]) && args[0].point && args[0].fillet !== undefined) {
      /*
      An array of point/fillet pairs, like
      [
        { point, fillet },
        { point, fillet },
      ]
      */

      segments = points_fillet_to_segments(args, false);
    } else if (Array.isArray(args[0]) && args[0].length <= 2 && Array.isArray(args[0][0])) {
      /*
      Point + fillet pairs as array, like
      [
        [[0, 0]],
        [[5, 5], 1],
        [[10, 0]]
      ]
      */

      segments = points_fillet_to_segments(args.map((a) => ({
        point: new Point(...a[0]),
        fillet: a[1] || 0,
      })));
    } else if (Array.isArray(args[0]) && args[0].length <= 3 && typeof args[0][0] === 'number') {
      /*
      Point + bulge as array
      [
        [0, 0],
        [1, 2, 3],
      ]
      */

      segments = points_fillet_to_segments(args.map((a) => ({
        point: new Point(a[0], a[1]),
        bulge: a[2] || 0,
      })));
    } else if (Array.isArray(args[0]) && typeof args[0][0] === 'number') {
      segments = args.map((a) => {
        // array numbers treated as segments
        if (a.length === 4) {
          return flatten.segment(...a);
        }
        // array of numbers treated as arcs

        return flatten.arc(flatten.point(a[0], a[1]), ...a.slice(2));
      });
    } else {
      /*
      Array of segments + arcs
      [
        Segment,
        Arc,
      ]
      */

      segments = args;
    }

    // construct from 2 points
    super(...segments);
  }
}


module.exports = Polyline;
