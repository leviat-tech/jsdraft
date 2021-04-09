module.exports = function render(sketch, options) {
  options = options ?? { nodes: true };
  if (options.nodes) {
    return JSON.stringify(sketch, null, 2);
  }
  return JSON.stringify(Array.from(sketch.shapes()));
};
