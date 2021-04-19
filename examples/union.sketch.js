function union(sketch) {
  const circle = sketch.circle([0, 0], 10);
  const a = circle.translate(10, 0);
  const b = circle.translate(0, 10);
  const c = circle.translate(-10, 0);
  const d = circle.translate(0, -10);
  return circle
    .rectangle([2, 0], [-2, -50])
    .union(a, b, c, d.entity('first'));
}
