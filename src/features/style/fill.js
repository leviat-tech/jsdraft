module.exports = function fill(sketch, color, opacity) {
  sketch.node.style.fill = { color, opacity };
  return sketch;
};
