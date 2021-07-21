module.exports = function layer(sketch, name) {
  sketch.node.layer = name;
  return sketch;
};
