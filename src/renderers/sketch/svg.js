const svg_renderer = require('../entity/svg');

// Return an SVG string
function recurse(sketch, style, show) {
  let svg = '';

  if (sketch.node.hidden && show === 'visible') return svg;
  if (!sketch.node.hidden && show === 'hidden') return svg;

  // set style
  let s;
  if (sketch.node.hidden) {
    s = {
      stroke: { color: '#aaa', width: '1px' },
      fill: { color: '#fff', opacity: '0.5' },
      annotation: { color: '#fff' },
    };
  } else {
    s = { ...sketch.node.style, ...style };
  }

  // draw entities
  if (sketch.node.entity) {
    svg += `\n${svg_renderer(sketch.node.entity, { style: s })}`;
  }

  // draw children
  for (const child of sketch.node.children) {
    svg += recurse(child, s, show);
  }

  return svg;
}

// Return an array of JS objects respresenting SVG nodes
function recurse_js(sketch, style, show) {
  let svg = [];

  if (sketch.node.hidden && show === 'visible') return svg;
  if (!sketch.node.hidden && show === 'hidden') return svg;

  let s;
  if (sketch.node.hidden) {
    s = {
      stroke: { color: '#aaa', width: '1px' },
      fill: { color: '#fff', opacity: '0.5' },
      annotation: { color: '#fff' },
    };
  } else {
    s = { ...sketch.node.style, ...style };
  }


  if (sketch.node.entity) {
    svg = [...svg, svg_renderer(sketch.node.entity, { output: 'js', style: s })];
  }

  for (const child of sketch.node.children) {
    svg = [...svg, ...recurse_js(child, s, show)];
  }

  return svg;
}

function render(sketch, { viewport = 'svg', show = 'visible' } = {}) {
  if (viewport === null) {
    return recurse(sketch, null, show);
  }

  if (viewport === 'js') {
    return recurse_js(sketch, null, show);
  }

  return `<${viewport}>${recurse(sketch)}</${viewport}>`;
}


module.exports = render;
