import Point from '../entities/point.js';
import Curve from '../entities/curve.js';


export default {
  name: 'line',
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
  ],
  func(sketch, point_a, point_b) {
    const line = new Curve(point_a, point_b);

    return sketch
      .create_entities(line);
  },
};
