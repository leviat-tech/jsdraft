module.exports = function stroke(c, width, color) {
  c.node.coloring.stroke = {width, color};
  return c;
}
