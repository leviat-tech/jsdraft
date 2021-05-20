function miter(
  sketch,
  side = 'left',
  angle = 20,
) {
  const big = 100;
  const dir = side === 'left' ? -1 : 1;
  const inner = sketch.new.segment([0, 0], [0, big]).rotate(dir * angle);
  const outer = inner.offset(-dir * big);
  const edge = sketch.hidden.find(side).show().edge(0);

  const cutter = sketch.new.polyface(
    ...inner.vertices,
    ...outer.edge(0).reverse().vertices,
  );

  cutterSnapped = cutter.snap(edge, sketch.new.segment([0, 0], [0, 1]).edge(0));

  return sketch.subtract(cutterSnapped);
}
