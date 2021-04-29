const get = require('lodash/get');
const set = require('lodash/set');
const svg_renderer = require('../entity/svg');
const calculate_viewbox = require('../utility/viewbox.js');


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

function render(sketch, {
  viewport = 'svg',
  show = 'visible',
  fit = true,
  aspect_ratio = 1,
  padding = 0,
  padding_top = 0,
  padding_right = 0,
  padding_bottom = 0,
  padding_left = 0,
  center = {},
  size = 1000,
  style = {},
} = {}) {
  if (viewport === null) {
    return recurse(sketch, style, show);
  }

  if (viewport === 'js') {
    return recurse_js(sketch, style, show);
  }

  if (viewport === 'svg') {
    const pad = {
      top: padding_top || padding,
      right: padding_right || padding,
      bottom: padding_bottom || padding,
      left: padding_left || padding,
    };

    const extents = sketch.extents;

    const scale = get(style, 'annotation.scale') || 1;

    const { viewbox, scalefactor } = calculate_viewbox(
      extents, fit, pad, aspect_ratio, scale, center, size,
    );


    set(style, 'annotation.scale', scale * scalefactor);

    return `<${viewport} viewBox="${viewbox}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" display="block">
  <g transform="scale(1 -1)">${recurse(sketch, style, show)}
  </g>
</${viewport}>`;
  }

  return `<${viewport}>${recurse(sketch, style, show)}</${viewport}>`;
}


module.exports = render;
