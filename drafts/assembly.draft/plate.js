function miter(sketch, side = 'left', B=5, L=15) {
  const dir = side === 'left' ? 1 : -1;
  const offset = sketch.offset(dir * B);
  return sketch.new.polyface(
    [offset.vertices[1].x, L],
    offset.vertices[0],
    sketch.vertices[0],
    [sketch.vertices[1].x, L]
  );
}
