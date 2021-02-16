module.exports = function tag(c, str) {
  c.node.tags.add(str);
  return c;
}
