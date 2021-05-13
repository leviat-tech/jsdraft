function miter(sketch, side = 'left') {
  const dir = side === 'left' ? 1 : -1;
  const offset = sketch.offset(dir * 10);
  return sketch.new.polyface(
    offset.vertices[0],
    ...sketch.vertices,
  );
}
