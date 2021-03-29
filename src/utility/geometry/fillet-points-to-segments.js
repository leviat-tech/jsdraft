const fillet = require('./fillet.js');
const sagitta_arc = require('./sagitta-arc.js');
const Segment = require('../../entities/geometric/segment.js');
const Arc = require('../../entities/geometric/arc.js');
const points_are_near = require('./points-are-near.js');


function should_fillet(point_array, index) {
  const point = point_array[index];

  return point.fillet
    && point_array[index + 1]
    && point_array[index - 1];
}

/*
Translate from a list of points and fillet values formatted like:
[
  { point: [0, 0] },
  { point: [10, 0], fillet: 1 },
  { point: [10, 10] },
  { point: [15, 10], bulge: 1 },
  { point: [15, 0] },
]

to an array of segments and arcs. Supports either closed or open polycurves.
*/

function fillet_points_to_segments(points, closed) {
  const pts = [...points];
  const segs = [];
  let pen;
  const fillet_initial = closed && !!pts[0].fillet;

  // Check whether initial point requires filleting
  if (fillet_initial) {
    const { point_a, point_b, bulge } = fillet(
      pts[pts.length - 1].point,
      pts[0].point,
      pts[1].point,
      pts[0].fillet,
    );

    const {
      radius,
      center,
      start_angle,
      end_angle,
      ccw,
    } = sagitta_arc(point_a, point_b, bulge);

    pts.push({ point: point_a });
    segs.push(new Arc(center, radius, start_angle, end_angle, ccw));
    pen = point_b;

  // Or whether it requires a closing segment
  } else if (closed) {
    pts.push(pts[0]);
    pen = pts[0].point;
  } else {
    pen = pts[0].point;
  }

  // Iterate through remaining points
  pts.slice(1).forEach((point, i) => {
    if (should_fillet(pts, i + 1)) {
      const fc = fillet(
        pts[i].point,
        point.point,
        pts[(i + 2) % pts.length].point,
        point.fillet,
      );

      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(fc.point_a, fc.point_b, fc.bulge);

      if (!points_are_near(pen, fc.point_a)) segs.push(new Segment(pen, fc.point_a));

      segs.push(
        new Arc(center, radius, start_angle, end_angle, ccw),
      );
      pen = fc.point_b;
    } else if (point.bulge) {
      const {
        radius,
        center,
        start_angle,
        end_angle,
        ccw,
      } = sagitta_arc(pen, point.point, point.bulge);

      segs.push(new Arc(center, radius, start_angle, end_angle, ccw));
      pen = point.point;
    } else {
      if (!points_are_near(pen, point.point)) segs.push(new Segment(pen, point.point));
      pen = point.point;
    }
  });

  return segs;
}


module.exports = fillet_points_to_segments;
