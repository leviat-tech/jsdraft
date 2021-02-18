module.exports = function basic(sketch) {
  return sketch.draw(
    sketch.circle(50, 50, 10),
    sketch.circle(25, 25, 10)
  )
  .fill('blue')
  .stroke(2, 'red');
};
