const { entity_to_svg } = require('../utility/misc/entity-to-svg.js');


const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  stroke_width: '1.5px',
  fill: 'white',
  vector_effect: 'non-scaling-stroke',
};

function style_to_svg_attributes(style) {
  return {
    ...(style.stroke?.width && { stroke_width: style.stroke.width }),
    ...(style.stroke?.color && { stroke: style.stroke.color }),
    ...(style.stroke?.scaled && { vector_effect: 'none' }),
    ...(style.stroke?.pattern && { stroke_dasharray: style.stroke.pattern }),
    ...(style.stroke?.opacity && { stroke_opacity: style.stroke.opacity }),
    ...(style.fill?.color && { fill: style.fill.color }),
    ...(style.fill?.opacity && { fill_opacity: style.fill.opacity }),
    ...(style.opacity && { opacity: style.opacity }),
  };
}

function recurse(sketch, style) {
  let svg = '';

  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  for (const entity of sketch.node.entities) {
    const styles = {
      ...DEFAULT_ATTRIBUTES,
      ...style_to_svg_attributes(s),
    };

    svg += `\n${entity_to_svg(entity, styles)}`;
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
