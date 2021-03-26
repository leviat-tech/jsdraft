function recurse(sketch, style) {
  let svg = '';

  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  for (const entity of sketch.node.entities) {
    svg += `\n${entity.svg(s)}`;
  }

  // draw children
  for (const child of sketch.node.children) {
    svg += recurse(child, s);
  }

  return svg;
}

function render(sketch, options) {
  options = options || { viewport: 'svg' };
  if (options.viewport === null) {
    return recurse(sketch);
  }
  return `<${options.viewport}>${recurse(sketch)}</svg>`;
}


module.exports = render;
