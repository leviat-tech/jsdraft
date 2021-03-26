const Vector = require('@crhio/vector').default;
const { base_entity_type } = require('../../utility/misc/entity-type');
const svg_string = require('../../utility/misc/svg-string');
const { rad_to_deg } = require('../../utility/misc/rad-deg');


const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  stroke_width: '1.5px',
  fill: 'white',
  vector_effect: 'non-scaling-stroke',
};

function style_to_svg(style) {
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

function svg_v_align(prop) {
  return {
    top: 'hanging',
    middle: 'central',
    bottom: 'baseline',
  }[prop];
}

function svg_h_align(prop) {
  return {
    center: 'middle',
    left: 'start',
    right: 'end',
  }[prop];
}


const renderers = {
  point: function point(entity, styles) {
    const attributes = {
      stroke: 'black',
      ...style_to_svg(styles),
      d: `M${entity.x},${entity.y} L${entity.x},${entity.y + 0.0001}`,
      stroke_linecap: 'round',
      stroke_width: '10px',
      vector_effect: 'non-scaling-stroke',
    };

    return svg_string('path', attributes);
  },


  segment: function segment(entity, styles) {
    const d = `M${entity.start.x},${entity.start.y} L${entity.end.x},${entity.end.y}`;
    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      ...style_to_svg(styles),
      d,
    };

    return svg_string('path', attributes);
  },


  arc: function arc(entity, styles) {
    const laf = entity.sweep <= Math.PI ? '0' : '1';
    const sf = entity.counterClockwise ? '1' : '0';
    const d = `M${entity.start.x},${entity.start.y} A${entity.r},${entity.r},${laf},${sf},${entity.end.x},${entity.end.y}`;

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      fill: 'transparent',
      ...style_to_svg(styles),
      d,
    };

    return svg_string('path', attributes);
  },


  polycurve: function polycurve(entity, styles) {
    let d = `M${entity.first.start.x},${entity.first.start.y}`;
    for (const edge of entity) { d += edge.svg(); }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      fill: 'transparent',
      ...style_to_svg(styles),
      d,
    };

    return svg_string('path', attributes);
  },


  polyface: function polyface(entity, styles) {
    let d = '';
    for (const face of entity.faces) { d += face.svg(); }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      ...style_to_svg(styles),
      d,
    };

    return svg_string('path', attributes);
  },


  aligned_dim: function aligned_dim(entity, {
    annotation: {
      extension: ex = 5,
      hash_length: hl = 5,
      offset: os = 50,
      text_offset: to = 10,
      precision: pr = 0,
      scale: s = 1,
      font_size = 12,
      h_align = 'center',
      v_align = 'middle',
      color = 'black',
      width = '1px',
    } = {},
  }) {
    const v1 = Vector({ x: entity.ps.x, y: entity.ps.y });
    const v2 = Vector({ x: entity.pe.x, y: entity.pe.y });
    const length = v2.subtract(v1).magnitude();
    const dim_vector = length !== 0 ? v2.subtract(v1).normalize() : Vector({ x: 1, y: 0 });
    const ovec = entity.side === 'left' ? dim_vector.rotate(Math.PI / 2) : dim_vector.rotate(-Math.PI / 2);

    const hashoffset1 = ovec.scale(ex * s);
    const crossoffset = ovec.scale(os * s);
    const hashoffset2 = ovec.scale((hl + os) * s);
    const exoffset = dim_vector.scale(ex * s);
    const textoffset = ovec.scale(to * s);

    const a = v1.add(hashoffset1);
    const b = v1.add(hashoffset2);
    const c = v2.add(hashoffset1);
    const d = v2.add(hashoffset2);
    const e = v1.subtract(exoffset).add(crossoffset);
    const f = v2.add(exoffset).add(crossoffset);

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} M ${c.x} ${c.y} L ${d.x} ${d.y} M ${e.x} ${e.y} L ${f.x} ${f.y}`;

    const cp = v1.add(dim_vector.scale(length / 2)).add(crossoffset).add(textoffset);
    const ltext = length.toFixed(pr);

    const path_attributes = {
      stroke: color,
      vector_effect: 'non-scaling-stroke',
      stroke_width: width,
      d: path,
    };

    const rotation = -dim_vector.angleDeg();

    const text_attributes = {
      fill: color,
      x: cp.x,
      y: -cp.y,
      rotation,
      dominant_baseline: svg_v_align(v_align),
      text_anchor: svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      font_size: font_size * s,
    };

    const str = svg_string('path', path_attributes) + svg_string('text', text_attributes, ltext);

    return `<g>${str}</g>`;
  },


  text: function text(entity, {
    annotation: {
      scale: s = 1,
      font_size = 12,
      h_align = 'center',
      v_align = 'middle',
      color = 'black',
    } = {},
  }) {
    const text_attributes = {
      fill: color,
      x: entity.p.x,
      y: -entity.p.y,
      rotation: entity.rotation,
      dominant_baseline: svg_v_align(v_align),
      text_anchor: svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rad_to_deg(entity.rotation)},${entity.p.x},${-entity.p.y})`,
      font_size: font_size * s,
    };

    return svg_string('text', text_attributes, entity.text);
  },
};


function svg(entity, styles = {}) {
  const type = base_entity_type(entity);

  const renderer = renderers[type];
  return renderer(entity, styles);
}

module.exports = svg;
