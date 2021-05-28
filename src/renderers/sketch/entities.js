function render(sketch, { show = 'visible', serialize = false } = {}) {
  return [...sketch.shapes('depth', show)];
}

module.exports = render;
