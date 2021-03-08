const flatten = require('@flatten-js/core');
const svg_string = require('../utility/misc/svg-string.js');


const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  stroke_width: '1.5px',
  fill: 'white',
  vector_effect: 'non-scaling-stroke',
};


function entity_type(entity) {
  if (entity instanceof flatten.Point) return 'point';
  if (entity instanceof flatten.Segment) return 'segment';
  if (entity instanceof flatten.Arc) return 'arc';
  if (entity instanceof flatten.Multiline) return 'polycurve';
  if (entity instanceof flatten.Polygon) return 'polyface';
  return null;
}

const entity_svg = {
  // Point renders as a quasi-zero-size point, drawn with a 10px diameter pen
  point: (e, styles) => {
    const attributes = {
      ...styles,
      d: `M${e.x},${e.y} L${e.x},${e.y + 0.0001}`,
      stroke_linecap: 'round',
      stroke_width: '10px',
      vector_effect: 'non-scaling-stroke',
    };
    return svg_string('path', attributes);
  },

  segment: (e, styles) => {
    const d = `M${e.start.x},${e.start.y} L${e.end.x},${e.end.y}`;
    const attributes = {
      ...styles,
      d,
    };
    return svg_string('path', attributes);
  },

  arc: (e, styles) => {
    const laf = e.sweep <= Math.PI ? '0' : '1';
    const sf = e.counterClockwise ? '1' : '0';
    const d = `M${e.start.x},${e.start.y} A${e.r},${e.r},${laf},${sf},${e.end.x},${e.end.y}`;
    const attributes = {
      ...styles,
      d,
    };
    return svg_string('path', attributes);
  },

  // Polycurves should not have a closing "Z" segment drawn
  polycurve: (e, styles) => {
    let d = `M${e.first.start.x},${e.first.start.y}`;
    for (const edge of e) { d += edge.svg(); }

    const attributes = {
      ...styles,
      d,
    };

    return svg_string('path', attributes);
  },

  polyface: (e, styles) => {
    let d = '';
    for (const face of e.faces) { d += face.svg(); }

    const attributes = {
      ...styles,
      d,
    };

    return svg_string('path', attributes);
  },
};

function recurse(svg, sketch, style) {
  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  for (const entity of sketch.node.entities) {
    const type = entity_type(entity);
    const styles = {
      ...DEFAULT_ATTRIBUTES,
      ...s,
    };

    svg += `\n${entity_svg[type](entity, styles)}`;
  }

  // draw children
  for (const child of sketch.node.children) {
    svg += recurse(svg, child, s);
  }

  return svg;
}

function render(sketch, options) {
  options = options || { viewport: 'svg' };
  if (options.viewport === null) {
    return recurse('', sketch);
  }
  return `<${options.viewport}>${recurse('', sketch)}</svg>`;
}


module.exports = render;
