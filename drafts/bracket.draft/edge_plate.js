function plate(sketch, side = 'left', params = { B: 5, L: 15 }) {
  const dir = side === 'left' ? 1 : -1;
  const left = sketch.hidden.find(side).show();
  const inner = sketch.new
    .polycurve(
      [left.vertices[0].x, left.vertices[0].y],
      [left.vertices[0].x, left.vertices[0].y + params.L],
    );
  const outer = inner.offset(dir * params.B);

  const plate = sketch.polyface(
    ...inner.vertices,
    ...outer.edge(0).reverse().vertices,
  );

  return sketch.add(plate);
}
