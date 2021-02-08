import Point from '../entities/point.js';


export default {
  name: 'point',
  parameters: [
    {
      name: 'point',
      type: 'point',
      default: () => new Point(0, 0),
    },
  ],
  func(sketch, point) {
    return sketch
      .create_entities(point);
  },
};
