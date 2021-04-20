function broken_union(sketch) {
  const c = sketch.circle([0, 0], 10);
  const r = sketch.rectangle([0, 0], 10, 10);
  const b = sketch.rectangle([-10, 0], [1, -10]);

  const good = sketch.new.union(c, r);
  const bad = sketch.new.union(c, b);
  return sketch.add(
    c.fill('none').stroke('red'),
    r.fill('none').stroke('green'),

    good.explode().translate(30, 30).stroke('orange'),
    good.translate(30, 0).fill('blue'),
    good.translate(30, -30).rainbow(),

    bad.explode().translate(-30, 30).stroke('pink'),
    bad.translate(-30, -30).rainbow(),
    bad.rainbow().translate(-30, -60),

    bad.translate(-30, 0).fill('blue'),
    c.translate(-30, 0).fill('none').stroke('red'),
    b.translate(-30, 0).fill('none').stroke('yellow'),
  );
  // Totally broken unions look like they dissapear because they have edges but no faces/
  // I think this is probably due to the edge order, winding, direction etc.

  // Arc
  // pc: { x: -30, y: -30}
  // r: 10
  // start: { x: -29, y: -39.95}
  // end: { x: -40, y: -30}
  // startAngle: 4.813
  // endAngle: 3.142
  // counterClockwise: true
}
