import Polycurve from '../entities/polycurve.js';
import PolycurvePoint from '../entities/polycurve-point.js';
import fillet from '../geometry/fillet.js';


function should_fillet(point_array, index, closed) {
  const point = point_array[index];

  if (closed) {
    return point.fillet;
  }

  return point.fillet
    && point_array[index + 1]
    && point_array[index - 1];
}

export default {
  name: 'polyline',
  parameters: [
    {
      name: 'points',
      type: 'array',
      default: () => [],
      items: {
        type: 'polyline_point', // { point, fillet }
      },
    },
    {
      name: 'closed',
      type: 'boolean',
      default: false,
    },
  ],
  func(sketch, points, closed) {
    const pc_points = [new PolycurvePoint(points[0].point)];

    // "fillet" command must be converted to polycurve bulge segments
    points.slice(1).forEach((point, index) => {
      if (should_fillet(points, index + 1, closed)) {
        const fillet_crv = fillet(
          points[index].point,
          point.point,
          points[(index + 2) % points.length].point,
          point.fillet,
        );

        pc_points.push(new PolycurvePoint(fillet_crv.point_a));
        pc_points.push(new PolycurvePoint(fillet_crv.point_b, fillet_crv.bulge));
      } else {
        pc_points.push(new PolycurvePoint(point.point));
      }
    });

    if (closed) {
      if (points[0].fillet) {
        const fillet_crv = fillet(
          points[points.length - 1].point,
          points[0].point,
          points[1].point,
        );

        pc_points[0].point = fillet_crv.point_a;
        pc_points.push(new PolycurvePoint(fillet_crv.point_b, fillet_crv.bulge));
      }
    }

    const polyline = new Polycurve(pc_points, closed);

    return sketch
      .create_entities(polyline);
  },
};
