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
  );

  const c = sketch.group(
    sketch.polygon([
      [100, 100],
      [100, 150],
      [150, 100],
    ]).stroke(2, 'orange')
  );

  const p1 = sketch.polygon([
    [100, 100],
    [100, 150],
    [150, 100],
  ]).fill('black');

  const p2 = sketch.polygon([
    [110, 110],
    [105, 120],
    [130, 110],
  ]).fill('yellow');

  const sub = sketch.subtract(p1.shape, p2.shape).fill('green');

  const d = sketch.circle(75, 20, 10).fill('cyan');

  const t_d = d.translate(10, 10).fill('red');

  const e = sketch.polygon([
    [110, 110],
    [105, 120],
    [130, 110],
  ]).fill('purple');

  const e_r = e.scale(0.5).rotate(20).fill('blue')

  return sketch.draw(
    a,
    b,
    c,
    p1,
    p2,
    sub.translate(10, 0),
    d,
    t_d,
    e,
    e_r
  )
};
