const Vector = require('@crhio/vector').default;
const { base_entity_type } = require('../../utility/misc/entity-type');
const svg_string = require('../../utility/misc/svg-string');
const { rad_to_deg } = require('../../utility/misc/rad-deg');
const almost_equal = require('../../utility/misc/almost-equal.js');


const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  'stroke-width': '1.5px',
  fill: 'white',
  'vector-effect': 'non-scaling-stroke',
};

function style_to_svg(style) {
  return {
    ...(style.stroke?.width && { 'stroke-width': style.stroke.width }),
    ...(style.stroke?.color && { stroke: style.stroke.color }),
    ...(style.stroke?.scaled && { 'vector-effect': 'none' }),
    ...(style.stroke?.pattern && { 'stroke-dasharray': style.stroke.pattern }),
    ...(style.stroke?.opacity && { 'stroke-opacity': style.stroke.opacity }),
    ...(style.fill?.color && { fill: style.fill.color }),
    ...(style.fill?.opacity && { 'fill-opacity': style.fill.opacity }),
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
      'stroke-linecap': 'round',
      'stroke-width': '10px',
      'vector-effect': 'non-scaling-stroke',
    };

    return { tag: 'path', attributes };
  },


  segment: function segment(entity, styles) {
    const d = `M${entity.start.x},${entity.start.y} L${entity.end.x},${entity.end.y}`;
    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      ...style_to_svg(styles),
      d,
    };

    return { tag: 'path', attributes };
  },


  arc: function arc(entity, styles) {
    let laf;
    let d;
    const sf = entity.counterClockwise ? '1' : '0';

    // Circles need to be drawn as two semicircles
    if (almost_equal(entity.sweep, 2 * Math.PI)) {
      laf = '0';

      const ps = entity.start;
      const v = Vector(entity.pc).subtract(ps).normalize().scale(entity.r * 2);
      const pe = Vector(ps).add(v);

      const ha1 = `M${ps.x},${ps.y} A${entity.r},${entity.r},0,${laf},${sf},${pe.x},${pe.y}`;
      const ha2 = `A${entity.r},${entity.r},0,${laf},${sf},${ps.x},${ps.y}`;

      d = `${ha1} ${ha2}`;

    // Otherwise draw as a typical arc
    } else {
      laf = entity.sweep <= Math.PI ? '0' : '1';
      d = `M${entity.start.x},${entity.start.y} A${entity.r},${entity.r},0,${laf},${sf},${entity.end.x},${entity.end.y}`;
    }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      fill: 'transparent',
      ...style_to_svg(styles),
      d,
    };

    return { tag: 'path', attributes };
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

    return { tag: 'path', attributes };
  },


  polyface: function polyface(entity, styles) {
    let d = '';
    for (const face of entity.faces) { d += face.svg(); }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      'fill-rule': 'evenodd',
      ...style_to_svg(styles),
      d,
    };

    return { tag: 'path', attributes };
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
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
    };

    const r = -dim_vector.angleDeg();
    const rotation = (Math.abs(r) + 1.19209290e-7) > 90
      ? Math.sign(r) * -180 + r
      : r;

    const text_attributes = {
      fill: color,
      x: cp.x,
      y: -cp.y,
      rotation,
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: ltext },
      ],
    };
  },


  dim_string: function dim_string(entity, {
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

    const complete_path = entity.ticks.reduce((p, tick) => {
      const translation = dim_vector.scale(tick);
      const atick = a.add(translation);
      const btick = b.add(translation);

      return p.concat(` M ${atick.x} ${atick.y} L ${btick.x} ${btick.y}`);
    }, path);

    const text = entity.ticks.concat(length)
      .map((dist, i, arr) => {
        const prev = arr[i - 1] || 0;
        const l = dist - prev;
        const cp = v1.add(dim_vector.scale(prev + l / 2)).add(crossoffset).add(textoffset);
        const r = -dim_vector.angleDeg();
        const rotation = (Math.abs(r) + 1.19209290e-7) > 90
          ? Math.sign(r) * -180 + r
          : r;
        return {
          tag: 'text',
          contents: l.toFixed(pr),
          attributes: {
            rotation,
            x: cp.x,
            y: -cp.y,
            fontsize: font_size * s,
            fill: color,
            'dominant-baseline': svg_v_align(v_align),
            'text-anchor': svg_h_align(h_align),
            transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
            'font-size': font_size * s,
          },
        };
      });

    const path_attributes = {
      stroke: color,
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: complete_path,
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        ...text,
      ],
    };
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
    const attributes = {
      fill: color,
      x: entity.p.x,
      y: -entity.p.y,
      rotation: entity.rotation,
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rad_to_deg(entity.rotation)},${entity.p.x},${-entity.p.y})`,
      'font-size': font_size * s,
    };

    return { tag: 'text', attributes, contents: entity.text };
  },
};


function svg(entity, { output = 'string', style = {} } = {}) {
  const type = base_entity_type(entity);

  const renderer = renderers[type];
  const js = renderer(entity, style);

  if (output === 'js') return js;

  if (js.tag === 'g') {
    const str = js.nodes
      .map((o) => svg_string(o.tag, o.attributes, o.contents))
      .join('');
    return `<g>${str}</g>`;
  }

  return svg_string(js.tag, js.attributes, js.contents);
}

module.exports = svg;
