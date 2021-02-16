module.exports = function group(c, ...sketchs) {
  c.node.children.push(...sketchs);
  return c;
}
