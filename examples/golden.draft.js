export default {
  name: 'golden',
  parameters: [
    {
      name: 'size',
      type: 'number',
      default: 2,
      min: 0,
      max: 10,
    },
  ],
  func(sketch, size) {
    // draw square
    const square = sketch.square(0, 0, size, size);

    // draw circle
    const circle = sketch.circle(0, 0, square.shape.bottom.midpoint, square.shape.b);

    // return golden rectangle
    return sketch
      .rectangle(
        square.shape.a.x,
        square.shape.a.y,
        circle.shape.right.x,
        square.shape.b.y,
      );
  },
};
