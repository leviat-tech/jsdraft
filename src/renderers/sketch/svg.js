const svg_renderer = require('../entity/svg');

// Return an SVG string
function recurse(sketch, style) {
  let svg = '';

  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  if (sketch.node.entity) {
    svg += `\n${svg_renderer(sketch.node.entity, { style: s })}`;
  }

  // draw children
  for (const child of sketch.node.children) {
    svg += recurse(child, s);
  }

  return svg;
}

// Return an array of JS objects respresenting SVG nodes
function recurse_js(sketch, style) {
  let svg = [];
  const s = { ...sketch.node.style, ...style };

  if (sketch.node.entity) {
    svg = [...svg, svg_renderer(sketch.node.entity, { output: 'js', style: s })];
  }

  for (const child of sketch.node.children) {
    svg = [...svg, ...recurse_js(child, s)];
  }

  return svg;
}

function render(sketch, { viewport = 'svg' } = {}) {
  if (viewport === null) {
    return recurse(sketch, null);
  }

  if (viewport === 'js') {
    return recurse_js(sketch, null);
  }

  return `<${viewport}>${recurse(sketch)}</${viewport}>`;
}


module.exports = render;
