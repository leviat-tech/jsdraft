import Point from '../entities/point.js';
import Curve from '../entities/curve.js';


export default {
  name: 'curve',
  parameters: [
    {
      name: 'point_a',
      type: 'point',
      default: () => new Point(0, 0),
    },
    {
      name: 'point_b',
      type: 'point',
      default: () => new Point(1, 0),
    },
    {
      name: 'bulge',
      type: 'number',
      default: 0,
    },
  ],
  func(sketch, point_a, point_b, bulge) {
    const curve = new Curve(point_a, point_b, bulge);

    return sketch
      .create_entities(curve);
  },
};
