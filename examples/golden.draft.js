module.exports = function golden(c, size) {

  // draw square ruler
  square = c.square(0, 0, size, size).ruler();

  // draw circle ruler
  circle = c.circle(square.shape.bottom.midpoint, square.shape.b).ruler();

  // draw golden rectangle
  rectangle = c.rectangle(square.shape.a.x, square.shape.a.y, circle.shape.right.x, square.shape.b.y)

  // return rulers and rectangle
  return c.group(
    square,
    circle,
    rectangle
  )
};
