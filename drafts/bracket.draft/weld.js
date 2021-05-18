function weld(sketch, side = 'left', B=3) {
  const dir = side === 'left' ? 1 : -1;
  const offset = sketch.offset(dir * B);
  return offset
//   const top = sketch.new.polycurve(
//   sketch.vertices[0],
//   offset.vertices[0],
//   )
// const bottom = sketch.new.polycurve(
//   sketch.vertices.slice(-1)[0],
//   offset.vertices.slice(-1)[0],
//   )
// return sketch.new.add(sketch, offset, top, bottom)
// .join()
//   .hatch("crosshatch", 1, 0, 'black', 'none')
}
