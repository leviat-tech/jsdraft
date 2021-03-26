const flatten = require('@flatten-js/core');
const Point = require('../geometric/point');
const { normalize } = require('../../utility/arguments');
const svg_string = require('../../utility/misc/svg-string');
const { svg_v_align, svg_h_align } = require('../../utility/misc/svg-style');
const { rad_to_deg } = require('../../utility/misc/rad-deg');


class Text {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of a point, a text string, and a rotation property
      [[0, 0], "text", Math.PI / 4]
    */

    this.text = args[0];
    this.p = args[1] ? new Point(...args[1]) : new Point(0, 0);
    this.rotation = args[2] || 0;
  }

  transform(matrix = new flatten.Matrix()) {
    return new Text(this.text, this.p.transform(matrix), this.rotation);
  }

  svg({
    annotation: {
      scale: s = 1,
      font_size = 12,
      h_align = 'center',
      v_align = 'middle',
      color = 'black',
    } = {},
  } = {}) {
    const text_attributes = {
      fill: color,
      x: this.p.x,
      y: -this.p.y,
      rotation: this.rotation,
      dominant_baseline: svg_v_align(v_align),
      text_anchor: svg_h_align(h_align),
      transform: `scale(1 -1) rotate(${rad_to_deg(this.rotation)},${this.p.x},${-this.p.y})`,
      font_size: font_size * s,
    };

    return svg_string('text', text_attributes, this.text);
  }
}

module.exports = Text;
