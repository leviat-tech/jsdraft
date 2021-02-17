module.exports = function group(sketch, ...sketches) {
  return sketch.create().add(...sketches)
}
