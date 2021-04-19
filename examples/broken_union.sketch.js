function broken_union(sketch) {
  const c = sketch.circle([0, 0], 10);
  const r = sketch.rectangle([0, 0], 10, 10);
  const bad = sketch.rectangle([-10, 0], [1, -10]);
  return sketch.add(
    sketch.new.union(c, r).translate(30, 0).fill('blue'),
    sketch.new.union(c, bad).translate(-30, 0).fill('blue'),
    c.translate(-30, 0).fill('none').stroke('red'),
    bad.translate(-30, 0).fill('none').stroke('yellow'),
    c.fill('none').stroke('red'),
    r.fill('none').stroke('green'),
  );
  // Totally broken unions look like they dissapear because they have edges but no faces/
  // I think this is probably due to the edge winding / direction etc.
}
