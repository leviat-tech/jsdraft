module.exports = function tag(sketch, str) {
  sketch.node.tags.push(str);
  return sketch;
};
