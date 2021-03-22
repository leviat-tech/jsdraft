const fillet = require('./fillet.js');
const sagitta_arc = require('./sagitta-arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Arc = require('../../entities/geometric/arc.js');


function should_fillet(point_array, index) {
  const point = point_array[index];

  return point[1]
    && point_array[index + 1]
    && point_array[index - 1];
}


/*
Translate from a list of points and fillet values formatted like:
[
  [[0, 0], 0],
  [[10, 0], 1],
  [[10, 10], 1],
  [[0, 10], 0]
]

to an array of segments and arcs. Supports either closed or open polycurves.
*/
function fillet_points_to_segments(points, closed) {
  const pts = [...points];
  const segs = [];
  let pen;
  const fillet_initial = closed && !!pts[0][1];

  // Check whether initial point requires filleting
  if (fillet_initial) {
    const { point_a, point_b, bulge } = fillet(
      pts[pts.length - 1][0],
      pts[0][0],
      pts[1][0],
      pts[1][1],
    );

    const {
      radius,
      center,
      start_angle,
      end_angle,
      ccw,
    } = sagitta_arc(point_a, point_b, bulge);

    pts.push([point_a, 0]);

    segs.push(new Arc(center, radius, start_angle, end_angle, ccw));
    pen = point_b;
  } else {
    pen = pts[0][0];
  }

  // Iterate though remaining points
  pts.slice(1).forEach((point, i) => {
    if (should_fillet(pts, i + 1)) {
      const fc = fillet(
        pts[i][0],
        point[0],
        pts[(i + 2) % pts.length][0],
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

  return segs;
}

module.exports = fillet_points_to_segments;
