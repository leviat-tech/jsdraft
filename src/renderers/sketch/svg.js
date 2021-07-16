const merge = require('lodash/merge');
const cloneDeep = require('lodash/cloneDeep');
const set = require('lodash/set');
const svg_renderer = require('../entity/svg');
const fit_viewbox = require('../utility/fit-viewbox.js');
const fit_vbscale = require('../utility/fit-vbscale.js');
const scale_viewbox = require('../utility/scale-viewbox.js');
const svg_string = require('../../utility/misc/svg-string.js');
const hatches = require('../../utility/misc/hatches.js');
const hash = require('../../utility/misc/hash.js');
const convert_units = require('../../utility/misc/convert-units.js');


function convert_transform_matrix(transform) {
  if (!transform) return '';
  return ` matrix(${transform.join(' ')})`;
}

function svg_arr_to_string(arr) {
  const h = {};
  let entities = arr.reduce((str, entity) => {

    if (entity.hatch && hatches[entity.hatch.pattern]) {
      const transform = convert_transform_matrix(entity.transform);
      const hash_input = `${entity.hatch.scale}-${entity.hatch.angle}-${entity.hatch.color}-${entity.hatch.background}-${entity.hatch.stroke_width}-${transform}`;
      const hatch_name = `${entity.hatch.pattern}-${hash(hash_input)}`;
      h[hatch_name] = hatches[entity.hatch.pattern](
        hatch_name,
        entity.hatch.scale,
        entity.hatch.angle,
        entity.hatch.color,
        entity.hatch.background,
        entity.hatch.stroke_width,
        transform,
      );
      set(entity, 'attributes.fill', `url(#${hatch_name})`);
    }

    return str + svg_string(entity);
  }, '');

  const hatch_arr = Object.values(h);
  if (hatch_arr.length > 0) {
    let defs = '\n<defs>';
    hatch_arr.forEach((hatch) => { defs = defs.concat(hatch); });
    defs = defs.concat('</defs>\n');
    entities = `${defs}${entities}`;
  }

  return entities;
}


// Return an array of JS objects respresenting SVG nodes
function recurse(sketch, options) {
  options = cloneDeep(options);
  const svg = [];

  if (sketch.node.hidden && options.show === 'visible') return svg;
  if (!sketch.node.hidden && options.show === 'hidden') return svg;

  // set style
  if (sketch.node.hidden) {
    options.style = {
      stroke: { color: '#aaa', width: '1px' },
      fill: { color: '#fff', opacity: '0.5' },
      annotation: { color: '#fff' },
    };
  } else {
    options.style = merge({}, options.style, sketch.node.style);
  }

  // set z-index and transformation matrix
  options.z = sketch.node.z || options.z;
  options.transform = sketch.node.transform;
  options.mask = options.mask || (sketch.node.mask && `mask_${sketch.node.id}`);

  // draw mask
  if (sketch.node.mask) {
    const mask = svg_renderer(sketch.node.mask, {
      output: 'js',
      style: {
        fill: { color: 'white' },
        stroke: { color: 'none' },
      },
    });

    svg.push({
      tag: 'mask',
      attributes: { id: `mask_${sketch.node.id}` },
      nodes: [mask],
    });
  }

  // draw entities
  if (sketch.node.entity) {
    if (options.mask) {
      const entity = svg_renderer(sketch.node.entity, { output: 'js', ...options });
      set(entity, 'attributes.mask', `url(#${options.mask})`);
      svg.push(entity);
    } else {
      svg.push(svg_renderer(sketch.node.entity, { output: 'js', ...options }));
    }
  }

  // draw children
  for (const child of sketch.node.children) {
    svg.push(...recurse(child, options));
  }

  return svg;
}

function render(sketch, {
  viewport = 'svg',
  show = 'visible',
  fit = true,
  padding = 0,
  padding_top = 0,
  padding_right = 0,
  padding_bottom = 0,
  padding_left = 0,
  center,
  aspect_ratio = 1,
  model_unit = 'mm',
  plot_unit = model_unit,
  plot_size = convert_units(1000, 'mm', plot_unit),
  scale = 1,
  style = {},
} = {}) {
  style = cloneDeep(style);

  // Normalize plot settings
  const pad = {
    top: padding_top || padding,
    right: padding_right || padding,
    bottom: padding_bottom || padding,
    left: padding_left || padding,
  };

  const extents = sketch.extents;
  const size = convert_units(plot_size, plot_unit, model_unit);
  const ref_size = 1000;
  const annotation_scale = (viewport === 'svg' && fit)
    ? fit_vbscale(extents, pad, aspect_ratio)
    : size / (ref_size * scale);
  const model_scale = convert_units(1, 'mm', model_unit);
  const dim_conversion = convert_units(1, model_unit, plot_unit);
  const options = { style, show, annotation_scale, model_scale, dim_conversion };

  // No svg/g viewport defined, raw svg entities will be exported as string
  if (viewport === null) {
    const svg = recurse(sketch, options);
    svg.sort((a, b) => a.z - b.z);
    return svg_arr_to_string(svg);
  }

  // No svg/g viewport defined, raw svg entities will be exported as JS objects
  if (viewport === 'js') {
    const svg = recurse(sketch, options);
    svg.sort((a, b) => a.z - b.z);
    return svg;
  }

  // Viewport is defined as "svg", therefore a viewBox property can be added to output
  if (viewport === 'svg') {
    const viewbox = fit
      ? fit_viewbox(extents, pad, aspect_ratio)
      : scale_viewbox(extents, aspect_ratio, center, size / scale);

    const svg = recurse(sketch, options);
    svg.sort((a, b) => a.z - b.z);

    return `<${viewport} viewBox="${viewbox}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" display="block">
  <g transform="scale(1 -1)">${svg_arr_to_string(svg)}
  </g>
</${viewport}>`;
  }

  const svg = recurse(sketch, options);
  svg.sort((a, b) => a.z - b.z);
  return `<${viewport}>${svg_arr_to_string(svg)}</${viewport}>`;
}


module.exports = render;
