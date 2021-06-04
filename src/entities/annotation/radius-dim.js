const flatten = require('@flatten-js/core');
const Arc = require('../geometric/arc.js');
const Point = require('../geometric/point.js');
const { normalize, matches } = require('../../utility/arguments');


class RadiusDim {
  constructor(...args) {
    args = normalize(args);

    // circle, point
    if (args[0] instanceof flatten.Polygon) {
      this.pc = args[0].pc;
      this.r = args[0].r;
      this.pt = new Point(...args[1]);

    // arc, point
    } else if (matches(args, 'arc', 'point')) {
      const arc = new Arc(...args[0]);
      this.pc = arc.pc;
      this.r = arc.r;
      this.pt = new Point(...args[1]);

    // point, radius, point
    } else if (matches(args, 'point', 'number', 'point')) {
      this.pc = new Point(...args[0]);
      this.r = args[1];
      this.pt = new Point(...args[2]);
    }
  }

  get type() { return 'radius_dim'; }

  get box() {
    return {
      xmin: Math.min(this.pc.x - this.r, this.pt.x),
      xmax: Math.max(this.pc.x + this.r, this.pt.x),
      ymin: Math.min(this.pc.y - this.r, this.pt.y),
      ymax: Math.max(this.pc.y + this.r, this.pt.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new RadiusDim(this.pc.transform(matrix), this.r, this.pt.transform(matrix));
  }

  toJSON() {
    return { ...this, pc: { ...this.pc }, pt: { ...this.pt } };
  }
}

module.exports = RadiusDim;
