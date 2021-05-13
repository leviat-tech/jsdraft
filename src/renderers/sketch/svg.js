const merge = require('lodash/merge');
const get = require('lodash/get');
const set = require('lodash/set');
const svg_renderer = require('../entity/svg');
const calculate_viewbox = require('../utility/viewbox.js');
const svg_string = require('../../utility/misc/svg-string.js');
const hatches = require('../../utility/misc/hatches.js');


// generate a unique id given an input
function hash(v) {
  const str = String(v);
  let h = 0;
  if (str.length === 0) return h;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    h = ((h << 5) - h) + char;
    h &= h; // Convert to 32bit integer
  }
  return h;
}

function svg_arr_to_string(arr) {
  const h = {};
  let entities = arr.reduce((str, entity) => {

    if (entity.hatch && hatches[entity.hatch.pattern]) {
      const hatch_name = `${entity.hatch.pattern}-${hash(entity.hatch.scale)}`;
      h[hatch_name] = hatches[entity.hatch.pattern](
        hatch_name,
        entity.hatch.scale,
        entity.hatch.angle,
        entity.hatch.color,
        entity.hatch.background,
      );
      set(entity, 'attributes.fill', `url(#${hatch_name})`);
    }

    if (entity.tag === 'g') {
      const s = entity.nodes
        .map((o) => svg_string(o.tag, o.attributes, o.contents))
        .join('');
      return `${str}<g>${s}</g>`;
    }

    return str + svg_string(entity.tag, entity.attributes, entity.contents);
  }, '');

  Object.values(h).forEach((hatch) => { entities = `${hatch}${entities}`; });
  return entities;
}


// Return an array of JS objects respresenting SVG nodes
function recurse(sketch, style, show, z) {
  let svg = [];

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
    s = merge({}, style, sketch.node.style);
  }

  // set z-index
  z = sketch.node.z || z;

  // draw entities
  if (sketch.node.entity) {
    svg = [...svg, svg_renderer(sketch.node.entity, { output: 'js', style: s, z })];
  }

  // draw children
  for (const child of sketch.node.children) {
    svg = [...svg, ...recurse(child, s, show, z)];
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
  center,
  size = 1000,
  scale = 1,
  style = {},
} = {}) {

  if (viewport === null) {
    const svg = recurse(sketch, style, show);
    svg.sort((a, b) => a.z - b.z);
    return svg_arr_to_string(svg);
  }

  if (viewport === 'js') {
    const svg = recurse(sketch, style, show);
    svg.sort((a, b) => a.z - b.z);
    return svg;
  }

  if (viewport === 'svg') {
    const pad = {
      top: padding_top || padding,
      right: padding_right || padding,
      bottom: padding_bottom || padding,
      left: padding_left || padding,
    };

    const extents = sketch.extents;
    const anno_scale = get(style, 'annotation.scale') || 1;
    const { viewbox, scalefactor } = calculate_viewbox(
      extents, fit, pad, aspect_ratio, center, size / scale,
    );
    set(style, 'annotation.scale', anno_scale * scalefactor);

    const svg = recurse(sketch, style, show);
    svg.sort((a, b) => a.z - b.z);

    return `<${viewport} viewBox="${viewbox}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" display="block">
  <g transform="scale(1 -1)">${svg_arr_to_string(svg)}
  </g>
</${viewport}>`;
  }

  const svg = recurse(sketch, style, show);
  svg.sort((a, b) => a.z - b.z);
  return `<${viewport}>${svg_arr_to_string(svg)}</${viewport}>`;
}


module.exports = render;
