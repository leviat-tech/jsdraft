module.exports = function draw(sketch) {

  const a = sketch.group(
    sketch.point(20, 20),
    sketch.segment(1, 1, 50, 50),
    sketch.circle(75, 75, 10),
    sketch.arc(50, 25, 15, 0, 3.14 / 2),
  )
  .stroke(2, 'red')
  .fill('blue');

  const b = sketch.group(
    sketch.circle(25, 50, 10).stroke(3, 'green'),
    sketch.multiline(
      [60, 30, 60, 100],
      [60, 100, 100, 30],
      [100, 30, 15, 0, 3.14 / 2],
    ).stroke(2, 'pink')
  )

  const c = sketch.group(
    sketch.polygon([
      [100, 100],
      [100, 150],
      [150, 100],
    ]).stroke(2, 'orange')
  )

  return sketch.draw(
    a,
    b,
    c
  )
};
