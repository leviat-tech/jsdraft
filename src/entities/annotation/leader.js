const flatten = require('@flatten-js/core');
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');


class Leader {
  constructor(...args) {
    args = normalize(args);

    this.text = args[0];
    this.ps = args[1] ? new Point(...args[1]) : new Point(0, 0);
    this.pe = args[2] ? new Point(...args[2]) : new Point(10, 0);
  }

  get type() { return 'leader'; }

  get box() {
    return {
      xmin: Math.min(this.ps.x, this.pe.x),
      xmax: Math.max(this.ps.x, this.pe.x),
      ymin: Math.min(this.ps.y, this.pe.y),
      ymax: Math.max(this.ps.y, this.pe.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new Leader(this.text, this.ps.transform(matrix), this.pe.transform(matrix));
  }

  toJSON() {
    return { ...this, ps: { ...this.ps }, pe: { ...this.pe } };
  }
}

module.exports = Leader;
