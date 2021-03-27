const svg_renderer = require('../entity/svg');


function recurse(sketch, style) {
  let svg = '';

  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  if (sketch.node.entity) {
    svg += `\n${svg_renderer(sketch.node.entity, s)}`;
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
