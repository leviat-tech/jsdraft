const { v4: uuidv4 } = require('uuid');
const { Vector } = require('@crhio/vector');
const { base_entity_type } = require('../../utility/misc/entity-type');
const svg_string = require('../../utility/misc/svg-string');
const { rad_to_deg } = require('../../utility/misc/rad-deg');
const almost_equal = require('../../utility/misc/almost-equal.js');
const points_are_near = require('../../utility/geometry/points-are-near.js');
const svg_color = require('../../utility/misc/svg-color.js');


const DEFAULT_ATTRIBUTES = {
  stroke: 'black',
  'stroke-width': '1.5px',
  fill: 'white',
  'vector-effect': 'non-scaling-stroke',
};

function style_to_svg(style) {
  return {
    ...(style.stroke?.width && { 'stroke-width': style.stroke.width }),
    ...(style.stroke?.color && { stroke: svg_color(style.stroke.color) }),
    ...(style.stroke?.scaled && { 'vector-effect': 'none' }),
    ...(style.stroke?.pattern && { 'stroke-dasharray': style.stroke.pattern }),
    ...(style.stroke?.opacity && { 'stroke-opacity': style.stroke.opacity }),
    ...(style.fill?.color && { fill: svg_color(style.fill.color) }),
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
  point: function point(entity, { style } = {}) {
    const attributes = {
      stroke: 'black',
      ...style_to_svg(style),
      d: `M${entity.x},${entity.y} L${entity.x},${entity.y + 0.0001}`,
      'stroke-linecap': 'round',
      'stroke-width': '10px',
      'vector-effect': 'non-scaling-stroke',
    };

    return { tag: 'path', attributes };
  },


  segment: function segment(entity, { style } = {}) {
    const d = `M${entity.start.x},${entity.start.y} L${entity.end.x},${entity.end.y}`;
    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      ...style_to_svg(style),
      d,
    };

    return { tag: 'path', attributes };
  },


  arc: function arc(entity, { style = {} } = {}) {
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
      ...style_to_svg(style),
      d,
    };

    return { tag: 'path', attributes };
  },


  polycurve: function polycurve(entity, { style = {} } = {}) {
    let d = `M${entity.first.start.x},${entity.first.start.y}`;
    for (const edge of entity) { d += edge.svg(); }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      fill: 'transparent',
      ...style_to_svg(style),
      d,
    };

    return { tag: 'path', attributes };
  },


  polyface: function polyface(entity, { model_scale = 1, style = {} } = {}) {
    let d = '';
    for (const face of entity.faces) { d += face.svg(); }

    const attributes = {
      ...DEFAULT_ATTRIBUTES,
      'fill-rule': 'evenodd',
      ...style_to_svg(style),
      d,
    };

    const hatch_scale = style.fill?.hatch_scale || 1;

    return {
      tag: 'path',
      attributes,
      ...(style.fill?.hatch && {
        hatch: {
          pattern: style.fill.hatch,
          angle: style.fill.hatch_angle || 0,
          scale: hatch_scale * model_scale,
          color: svg_color(style.fill.hatch_color) || 'black',
          background: style.fill.hatch_background || 'white',
          stroke_width: style.fill.hatch_stroke_width || 1,
        },
      }),
    };
  },


  aligned_dim: function aligned_dim(entity, {
    annotation_scale = 1,
    dim_conversion = 1,
    style: {
      annotation: {
        extension: ex = 5,
        hash_length: hl = 5,
        offset: os = 50,
        text_offset: to = 10,
        precision: pr = 4,
        scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    if (points_are_near(entity.ps, entity.pe)) return null;

    const s = annotation_scale * scale;
    const v1 = Vector({ x: entity.ps.x, y: entity.ps.y });
    const v2 = Vector({ x: entity.pe.x, y: entity.pe.y });
    const length = v2.subtract(v1).magnitude();
    const dim_vector = length !== 0 ? v2.subtract(v1).normalize() : Vector({ x: 1, y: 0 });

    const ovec = (entity.offset < 0 || entity.offset === 'right')
      ? dim_vector.rotate(Math.PI / 2).reverse()
      : dim_vector.rotate(Math.PI / 2);

    const offset = (typeof entity.offset === 'number')
      ? Math.abs(entity.offset)
      : os * s;

    const hashoffset1 = ovec.scale(ex * s);
    const crossoffset = ovec.scale(offset);
    const hashoffset2 = ovec.scale(offset + (hl * s));
    const exoffset = dim_vector.scale(ex * s);
    const textoffset = ovec.scale(to * s);

    const a = v1.add(hashoffset1);
    const b = v1.add(hashoffset2);
    const c = v2.add(hashoffset1);
    const d = v2.add(hashoffset2);
    const e = v1.subtract(exoffset).add(crossoffset);
    const f = v2.add(exoffset).add(crossoffset);

    const g = v1.add(crossoffset);
    const h = v2.add(crossoffset);

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} M ${c.x} ${c.y} L ${d.x} ${d.y} M ${e.x} ${e.y} L ${f.x} ${f.y}`;

    const ltext = parseFloat((length * dim_conversion).toPrecision(pr));
    const mask_w = font_size * s * (ltext.toString().length * 0.6 + 0.5);

    // if overall text width is less than the distance between points, then
    // position the dimension on the line. Otherwise position the dimension
    // above the line.
    const text_on_line = (mask_w * mask_w) < v1.distSq(v2);
    const cp = text_on_line
      ? v1.add(dim_vector.scale(length / 2)).add(crossoffset)
      : v1.add(dim_vector.scale(length / 2)).add(crossoffset).add(textoffset);
    const mask_id = uuidv4().slice(10);

    const path_attributes = {
      stroke: svg_color(color),
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
      ...(text_on_line && { mask: `url(#${mask_id})` }),
    };

    const circle_attributes = {
      r: s,
      fill: 'none',
      stroke: svg_color(color),
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
    };

    const r = -dim_vector.angleDeg();
    const rotation = (Math.abs(r) + 1.19209290e-7) > 90
      ? Math.sign(r) * -180 + r
      : r;

    const text_attributes = {
      fill: svg_color(color),
      x: cp.x,
      y: -cp.y,
      rotation,
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    const dim_min_x = Math.min(a.x, b.x, c.x, d.x, e.x, f.x) - s;
    const dim_max_x = Math.max(a.x, b.x, c.x, d.x, e.x, f.x) + s;
    const dim_min_y = Math.min(a.y, b.y, c.y, d.y, e.y, f.y) - s;
    const dim_max_y = Math.max(a.y, b.y, c.y, d.y, e.y, f.y) + s;
    const dim_attributes = {
      x: dim_min_x,
      y: dim_min_y,
      width: dim_max_x - dim_min_x,
      height: dim_max_y - dim_min_y,
      fill: 'white',
    };

    const mask_h = font_size * s * 2;
    const mask_attributes = {
      x: cp.x - mask_w / 2,
      y: cp.y - mask_h / 2,
      width: mask_w,
      height: mask_h,
      transform: `rotate(${-rotation},${cp.x},${cp.y})`,
      fill: 'black',
    };

    return {
      tag: 'g',
      nodes: [
        ...(text_on_line ? [{
          tag: 'mask',
          attributes: { id: mask_id },
          nodes: [
            { tag: 'rect', attributes: dim_attributes },
            { tag: 'rect', attributes: mask_attributes },
          ],
        }] : []),
        {
          tag: 'circle',
          attributes: { ...circle_attributes, cx: g.x, cy: g.y },
        },
        {
          tag: 'circle',
          attributes: { ...circle_attributes, cx: h.x, cy: h.y },
        },
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: ltext, callback: entity.callback },
      ],
    };
  },


  dim_string: function dim_string(entity, {
    annotation_scale = 1,
    dim_conversion,
    style: {
      annotation: {
        extension: ex = 5,
        hash_length: hl = 5,
        offset: os = 50,
        text_offset: to = 10,
        precision: pr = 4,
        scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    const s = annotation_scale * scale;
    const v1 = Vector({ x: entity.ps.x, y: entity.ps.y });
    const v2 = Vector({ x: entity.pe.x, y: entity.pe.y });
    const length = v2.subtract(v1).magnitude();
    const dim_vector = length !== 0 ? v2.subtract(v1).normalize() : Vector({ x: 1, y: 0 });

    const ovec = entity.offset < 0
      ? dim_vector.rotate(Math.PI / 2).reverse()
      : dim_vector.rotate(Math.PI / 2);

    const offset = entity.offset === undefined ? os * s : Math.abs(entity.offset);

    const hashoffset1 = ovec.scale(ex * s);
    const crossoffset = ovec.scale(offset);
    const hashoffset2 = ovec.scale(offset + (hl * s));
    const exoffset = dim_vector.scale(ex * s);
    const textoffset = ovec.scale(to * s);

    const a = v1.add(hashoffset1);
    const b = v1.add(hashoffset2);
    const c = v2.add(hashoffset1);
    const d = v2.add(hashoffset2);
    const e = v1.subtract(exoffset).add(crossoffset);
    const f = v2.add(exoffset).add(crossoffset);

    const g = v1.add(crossoffset);
    const h = v2.add(crossoffset);

    const circle_attributes = {
      r: s,
      fill: 'none',
      stroke: svg_color(color),
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
    };

    const circles = [
      {
        tag: 'circle',
        attributes: { ...circle_attributes, cx: g.x, cy: g.y },
      },
      {
        tag: 'circle',
        attributes: { ...circle_attributes, cx: h.x, cy: h.y },
      },
    ];

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} M ${c.x} ${c.y} L ${d.x} ${d.y} M ${e.x} ${e.y} L ${f.x} ${f.y}`;

    const complete_path = entity.ticks.reduce((p, tick) => {
      const translation = dim_vector.scale(tick);
      const atick = a.add(translation);
      const btick = b.add(translation);

      // Add circle to tick mark
      const circle = v1.add(translation).add(crossoffset);
      circles.push({
        tag: 'circle',
        attributes: { ...circle_attributes, cx: circle.x, cy: circle.y },
      });

      return p.concat(` M ${atick.x} ${atick.y} L ${btick.x} ${btick.y}`);
    }, path);

    const dim_min_x = Math.min(a.x, b.x, c.x, d.x, e.x, f.x) - s;
    const dim_max_x = Math.max(a.x, b.x, c.x, d.x, e.x, f.x) + s;
    const dim_min_y = Math.min(a.y, b.y, c.y, d.y, e.y, f.y) - s;
    const dim_max_y = Math.max(a.y, b.y, c.y, d.y, e.y, f.y) + s;
    const dim_attributes = {
      x: dim_min_x,
      y: dim_min_y,
      width: dim_max_x - dim_min_x,
      height: dim_max_y - dim_min_y,
      fill: 'white',
    };

    const mask_id = uuidv4().slice(10);
    const mask_nodes = [
      { tag: 'rect', attributes: dim_attributes },
    ];

    const text = entity.ticks.concat(length)
      .map((dist, i, arr) => {
        const prev = arr[i - 1] || 0;
        const l = dist - prev;

        const ltext = parseFloat((l * dim_conversion).toPrecision(pr));
        const mask_w = font_size * s * (ltext.toString().length * 0.6 + 0.5);

        // if overall text width is less than the distance between ticks, then
        // position the dimension on the line. Otherwise position the dimension
        // above the line.
        const text_on_line = mask_w < l;
        const cp = text_on_line
          ? v1.add(dim_vector.scale(prev + l / 2)).add(crossoffset)
          : v1.add(dim_vector.scale(prev + l / 2)).add(crossoffset).add(textoffset);

        const r = -dim_vector.angleDeg();
        const rotation = (Math.abs(r) + 1.19209290e-7) > 90
          ? Math.sign(r) * -180 + r
          : r;

        if (text_on_line) {
          const mask_h = font_size * s * 2;
          const mask_attributes = {
            x: cp.x - mask_w / 2,
            y: cp.y - mask_h / 2,
            width: mask_w,
            height: mask_h,
            fill: 'black',
            transform: `rotate(${-rotation},${cp.x},${cp.y})`,
          };

          mask_nodes.push({ tag: 'rect', attributes: mask_attributes });
        }

        return {
          tag: 'text',
          contents: parseFloat((l * dim_conversion).toPrecision(pr)),
          attributes: {
            rotation,
            x: cp.x,
            y: -cp.y,
            fontsize: font_size * s,
            fill: svg_color(color),
            'dominant-baseline': svg_v_align(v_align),
            'text-anchor': svg_h_align(h_align),
            transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
            'font-size': font_size * s,
            'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
          },
        };
      });

    const path_attributes = {
      stroke: svg_color(color),
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: complete_path,
      mask: `url(#${mask_id})`,
    };

    return {
      tag: 'g',
      nodes: [
        {
          tag: 'mask',
          attributes: { id: mask_id },
          nodes: mask_nodes,
        },
        { tag: 'path', attributes: path_attributes },
        ...circles,
        ...text,
      ],
    };
  },


  angle_dim: function angle_dim(entity, {
    annotation_scale = 1,
    style: {
      annotation: {
        extension: ex = 5,
        text_offset: to = 10,
        precision: pr = 4,
        scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    const s = annotation_scale * scale;
    const angle = entity.angle;
    const exta = entity.exta || (ex * s);
    const extb = entity.extb || (ex * s);

    const ctr = Vector(entity.ps);
    const pta = Vector(entity.pe);
    const vec = pta.subtract(ctr).normalize();
    const vec2 = vec.rotateDeg(angle);
    const cvec = vec.rotateDeg(angle / 2);
    const offset = pta.subtract(ctr).magnitude();

    const a = pta.subtract(vec.scale(exta));
    const b = pta.add(vec.scale(ex * s));
    const c = ctr.add(vec2.scale(offset - extb));
    const d = ctr.add(vec2.scale(offset + ex * s));
    const f = ctr.add(vec2.scale(offset));

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} M ${c.x} ${c.y} L ${d.x} ${d.y} M ${pta.x} ${pta.y} A ${offset} ${offset} 0 0 1 ${f.x} ${f.y}`;

    const cp = ctr.add(cvec.scale(offset + to * s));
    const atext = `${parseFloat(angle.toPrecision(pr))}°`;

    const path_attributes = {
      stroke: svg_color(color),
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
    };

    const rotation = 0;

    const text_attributes = {
      rotation,
      x: cp.x,
      y: -cp.y,
      fontsize: font_size * s,
      fill: svg_color(color),
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: atext },
      ],
    };
  },


  radius_dim: function radius_dim(entity, {
    annotation_scale = 1,
    dim_conversion = 1,
    style: {
      annotation: {
        extension: ex = 5,
        text_offset: to = 10,
        precision: pr = 4,
        scale = 1,
        font_size = 12,
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    const s = annotation_scale * scale;
    const pc = Vector(entity.pc);
    const pt = Vector(entity.pt);
    const r = entity.r;
    const vec = pt.subtract(pc).normalize();
    const angle = vec.angle();
    const textangle = entity.textangle || 0;
    const tvec = Vector({ x: 1, y: 0 }).rotate(textangle);
    const ahead1 = vec.rotateDeg(30).scale(ex * s);
    const ahead2 = vec.rotateDeg(-30).scale(ex * s);
    const leader_left = Math.cos(angle) < 0;
    const leadervec = leader_left ? tvec.rotateDeg(180) : tvec;

    const a = pc.subtract(vec.scale(r));
    const b = pt;
    const c = a.add(ahead1);
    const d = a.add(ahead2);
    const e = b.add(leadervec.scale(ex * s));
    const cross = (ex * s) / 2;
    const f = pc.subtract({ x: cross, y: 0 });
    const g = pc.add({ x: cross, y: 0 });
    const h = pc.add({ x: 0, y: cross });
    const i = pc.subtract({ x: 0, y: cross });

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${e.x} ${e.y} M ${c.x} ${c.y} L ${a.x} ${a.y} L ${d.x} ${d.y} M ${f.x} ${f.y} L ${g.x} ${g.y} M ${h.x} ${h.y} L ${i.x} ${i.y}`;

    const path_attributes = {
      stroke: svg_color(color),
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
    };

    const cp = e.add(leadervec.scale((to * s) / 2));
    const ltext = `R${parseFloat((r * dim_conversion).toPrecision(pr))}`;

    const rotation = rad_to_deg(textangle);
    const text_attributes = {
      rotation,
      x: cp.x,
      y: -cp.y,
      fontsize: font_size * s,
      fill: svg_color(color),
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': leader_left ? 'end' : 'start',
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: ltext },
      ],
    };
  },


  diameter_dim: function diameter_dim(entity, {
    annotation_scale = 1,
    dim_conversion = 1,
    style: {
      annotation: {
        extension: ex = 5,
        text_offset: to = 10,
        precision: pr = 4,
        scale = 1,
        font_size = 12,
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    const s = annotation_scale * scale;
    const pc = Vector(entity.pc);
    const pt = Vector(entity.pt);
    const r = entity.d / 2;
    const vec = pt.subtract(pc).normalize();
    const angle = vec.angle();
    const textangle = entity.textangle || 0;
    const tvec = Vector({ x: 1, y: 0 }).rotate(textangle);
    const ahead1 = vec.rotateDeg(30).scale(ex * s);
    const ahead2 = vec.rotateDeg(-30).scale(ex * s);
    const leader_left = Math.cos(angle) < 0;
    const leadervec = leader_left ? tvec.rotateDeg(180) : tvec;

    const a = pc.subtract(vec.scale(r));
    const b = pt;
    const c = a.add(ahead1);
    const d = a.add(ahead2);
    const e = b.add(leadervec.scale(ex * s));

    const cross = (ex * s) / 2;
    const f = pc.subtract({ x: cross, y: 0 });
    const g = pc.add({ x: cross, y: 0 });
    const h = pc.add({ x: 0, y: cross });
    const i = pc.subtract({ x: 0, y: cross });

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${e.x} ${e.y} M ${c.x} ${c.y} L ${a.x} ${a.y} L ${d.x} ${d.y} M ${f.x} ${f.y} L ${g.x} ${g.y} M ${h.x} ${h.y} L ${i.x} ${i.y}`;

    const path_attributes = {
      stroke: svg_color(color),
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
    };

    const cp = e.add(leadervec.scale((to * s) / 2));
    const ltext = `⌀${parseFloat((entity.d * dim_conversion).toPrecision(pr))}`;

    const rotation = rad_to_deg(textangle);
    const text_attributes = {
      rotation,
      x: cp.x,
      y: -cp.y,
      fontsize: font_size * s,
      fill: svg_color(color),
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': leader_left ? 'end' : 'start',
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: ltext },
      ],
    };
  },


  text: function text(entity, {
    annotation_scale = 1,
    style: {
      annotation: {
        scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
        color = 'black',
      } = {},
    } = {},
    transform,
  }) {
    const s = annotation_scale * scale;

    let t;
    if (transform) {
      t = [
        transform[0],
        transform[1],
        transform[2],
        transform[3],
        0,
        0,
      ];
      t = `translate(${entity.p.x}, ${entity.p.y}) matrix(${t.join(' ')}) translate(${-entity.p.x}, ${-entity.p.y}) `;
    } else {
      t = '';
    }

    const attributes = {
      fill: svg_color(color),
      x: entity.p.x,
      y: -entity.p.y,
      rotation: entity.rotation,
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': svg_h_align(h_align),
      transform: `${t}scale(1 -1) rotate(${rad_to_deg(entity.rotation)},${entity.p.x},${-entity.p.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    return { tag: 'text', attributes, contents: entity.text };
  },


  leader: function leader(entity, {
    annotation_scale = 1,
    style: {
      annotation: {
        extension: ex = 5,
        text_offset: to = 10,
        scale = 1,
        font_size = 12,
        v_align = 'middle',
        color = 'black',
        width = '1px',
      } = {},
    } = {},
  }) {
    const s = annotation_scale * scale;
    const ps = Vector(entity.ps);
    const pe = Vector(entity.pe);
    const vec = pe.subtract(ps).normalize();
    const angle = vec.angle();
    const textangle = entity.textangle || 0;
    const tvec = Vector({ x: 1, y: 0 }).rotate(textangle);
    const ahead1 = vec.rotateDeg(30).scale(ex * s);
    const ahead2 = vec.rotateDeg(-30).scale(ex * s);
    const leader_left = Math.cos(angle) < 0;
    const leadervec = leader_left ? tvec.rotateDeg(180) : tvec;

    const a = ps;
    const b = pe;
    const c = a.add(ahead1);
    const d = a.add(ahead2);
    const e = b.add(leadervec.scale(ex * s));

    const path = `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${e.x} ${e.y} M ${c.x} ${c.y} L ${a.x} ${a.y} L ${d.x} ${d.y}`;

    const path_attributes = {
      stroke: svg_color(color),
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
      'stroke-width': width,
      d: path,
    };

    const cp = e.add(leadervec.scale((to * s) / 2));
    const ltext = entity.text;

    const rotation = rad_to_deg(textangle);
    const text_attributes = {
      rotation,
      x: cp.x,
      y: -cp.y,
      fontsize: font_size * s,
      fill: svg_color(color),
      'dominant-baseline': svg_v_align(v_align),
      'text-anchor': leader_left ? 'end' : 'start',
      transform: `scale(1 -1) rotate(${rotation},${cp.x},${-cp.y})`,
      'font-size': font_size * s,
      'font-family': 'Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace',
    };

    return {
      tag: 'g',
      nodes: [
        { tag: 'path', attributes: path_attributes },
        { tag: 'text', attributes: text_attributes, contents: ltext },
      ],
    };
  },
};


function svg(entity, { output = 'string', ...options }) {
  const type = base_entity_type(entity);

  const renderer = renderers[type];
  const js = renderer(entity, options);

  if (!js) return null;

  js.z = options.z || 0;
  js.transform = options.transform || null;

  if (output === 'js') return js;

  return svg_string(js);
}

module.exports = svg;
