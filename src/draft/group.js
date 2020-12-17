module.exports = function group(c, ...compositions) {
  c.node.children.push(...compositions);
  return c;
}
