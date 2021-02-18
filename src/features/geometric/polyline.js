const fillet = require('../../utility/geometry/fillet.js');
const Point = require('../../entities/geometric/point.js');


function should_fillet(point_array, index, closed) {
  const point = point_array[index];

  if (closed) {
    return point.fillet;
  }

  return point.fillet
    && point_array[index + 1]
    && point_array[index - 1];
}

module.exports = function polyline(sketch, pline_points, closed) {
  const pc_points = [{ point: pline_points[0].point }];

  // "fillet" command must be converted to polycurve bulge segments
  pline_points.slice(1).forEach((pline_pt, index) => {
    if (should_fillet(pline_points, index + 1, closed)) {
      const fc = fillet(
        pline_points[index].point,
        pline_pt.point,
        pline_points[(index + 2) % pline_points.length].point,
        pline_pt.fillet,
      );

      pc_points.push(
        { point: new Point(fc.point_a.x, fc.point_a.y) },
        { point: new Point(fc.point_b.x, fc.point_b.y), bulge: fc.bulge },
      );
    } else {
      pc_points.push({ point: pline_pt.point });
    }
  });

  if (closed) {
    if (pline_points[0].fillet) {
      const fc = fillet(
        pline_points[pline_points.length - 1].point,
        pline_points[0].point,
        pline_points[1].point,
      );

      pc_points[0].point = new Point(fc.point_a.x, fc.point_a.y);
      pc_points.push({ point: new Point(fc.point_b.x, fc.point_b.y), bulge: fc.bulge });
    }
  }

  return sketch.polycurve(pc_points, closed);
};
