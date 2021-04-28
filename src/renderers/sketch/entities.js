function render(sketch, { show = 'visible' } = {}) {
  return [...sketch.shapes('depth', show)];
}

module.exports = render;
