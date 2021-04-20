module.exports = function stroke(sketch, color, width, opacity) {
  sketch.node.style.stroke = { width, color, opacity };
  return sketch;
};
