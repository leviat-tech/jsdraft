const flatten = require('@flatten-js/core');
const Vector = require('@crhio/vector').default;
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');
const svg_string = require('../../utility/misc/svg-string.js');
const { svg_v_align, svg_h_align } = require('../../utility/misc/svg-style');


class AlignedDim {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of two points for the start and end of the dimension:
      [[0, 0], [5, 5]]
    */

    this.ps = new Point(...args[0]);
    this.pe = new Point(...args[1]);
    this.side = args[2] ? args[2] : 'left';
  }

  transform(matrix = new flatten.Matrix()) {
    return new AlignedDim(this.ps.transform(matrix), this.pe.transform(matrix));
  }

  svg({
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
  } = {}) {
    const v1 = Vector({ x: this.ps.x, y: this.ps.y });
    const v2 = Vector({ x: this.pe.x, y: this.pe.y });
    const length = v2.subtract(v1).magnitude();
    const dim_vector = length !== 0 ? v2.subtract(v1).normalize() : Vector({ x: 1, y: 0 });
    const ovec = this.side === 'left' ? dim_vector.rotate(Math.PI / 2) : dim_vector.rotate(-Math.PI / 2);

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
  }
}

module.exports = AlignedDim;
