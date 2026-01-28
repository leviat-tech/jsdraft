const flatten = require('@flatten-js/core');
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');


class AngleDim {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of two points to define the arc center and starting point, and an angle
      [[0, 0], [5, 5], 30]
    */

    this.ps = new Point(...args[0]);
    this.pe = new Point(...args[1]);
    this.angle = args[2];

     this.options = (typeof args[4] === 'object' && args[4] !== null) ? args[4] : {};
  }

  get type() { return 'angle_dim'; }

  get box() {
    return {
      xmin: Math.min(this.ps.x, this.pe.x),
      xmax: Math.max(this.ps.x, this.pe.x),
      ymin: Math.min(this.ps.y, this.pe.y),
      ymax: Math.max(this.ps.y, this.pe.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new AngleDim(this.ps.transform(matrix), this.pe.transform(matrix), this.angle);
  }

  toJSON() {
    return { ...this, ps: { ...this.ps }, pe: { ...this.pe } };
  }
}

module.exports = AngleDim;
