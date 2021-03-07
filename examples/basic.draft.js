/* eslint-disable */
function basic(sketch) {
  return sketch.draw(
    sketch.point([0, 0]),
    sketch.point([25, 25])
  )
    .fill('blue')
    .stroke(2, 'red');
}
