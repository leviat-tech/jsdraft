module.exports = function stroke(sketch, color, width) {
  sketch.node.style.stroke = { width, color };
  return sketch;
};
