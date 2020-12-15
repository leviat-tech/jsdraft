module.exports = function stroke(c, width, color) {
  c.definition.stroke = {
    width,
    color
  }
  return c;
}
