/* eslint-disable */
function bbox(sketch) {
  return sketch
    .circle([-10, 0], 10)
    .circle([0, 10], 5)
    .circle([-50, 50], 2)
    .bbox()
    .fill('none')
}
