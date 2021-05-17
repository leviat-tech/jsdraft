function miter(sketch, side = 'left', B=2) {
  const dir = side === 'left' ? 1 : -1;
  const offset = sketch.offset(dir * B);
  const top = sketch.polycurve(
  sketch.vertices[0],
  offset.vertices[0],
  )
const bottom = sketch.polycurve(
  sketch.vertices.slice(-1)[0],
  offset.vertices.slice(-1)[0],
  )
return sketch.new.add(sketch, offset, top, bottom)
.join().hatch("crosshatch", 1, 0, 'black', 'none')
}
