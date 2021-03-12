const svg_string = require('./svg-string.js');
const { base_entity_type } = require('./entity-type.js');


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

function entity_to_svg(entity, styles) {
  const type = base_entity_type(entity);

  return entity_svg[type](entity, styles);
}

module.exports = entity_to_svg;
