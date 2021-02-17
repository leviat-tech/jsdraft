module.exports = function stroke(sketch, width, color) {
  sketch.node.style.stroke = {width, color};
  return sketch;
}
