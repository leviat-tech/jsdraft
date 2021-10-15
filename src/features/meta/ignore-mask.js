module.exports = function ignore_mask(sketch, ignore = true) {
  sketch.node.ignore_mask = ignore;

  return sketch;
};
