const flatten = require('@flatten-js/core');
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');
const orientation = require('../../utility/geometry/orientation.js');


class DimString {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of two points for the start and end of the dimension,
      and an array of "ticks" along the length of that dimension string:
      [[0, 0], [5, 5], [1, 2, 3, 4]]
    */

    this.ps = new Point(...args[0]);
    this.pe = new Point(...args[1]);
    this.ticks = args[2] ? args[2] : [];

    if (Array.isArray(args[3])) {
      const offset_pt = new Point(...args[3]);
      const line = flatten.line(this.ps, this.pe);
      const distance = line.distanceTo(offset_pt);
      const pe = distance[1].pe;
      const o = orientation(
        [this.ps.x, this.ps.y],
        [this.pe.x, this.pe.y],
        [pe.x, pe.y],
      );

      this.offset = o === 'clockwise'
        ? -distance[0]
        : distance[0];
    } else {
      this.offset = args[3];
    }
  }

  get type() { return 'dim_string'; }

  get box() {
    return {
      xmin: Math.min(this.ps.x, this.pe.x),
      xmax: Math.max(this.ps.x, this.pe.x),
      ymin: Math.min(this.ps.y, this.pe.y),
      ymax: Math.max(this.ps.y, this.pe.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new DimString(this.ps.transform(matrix), this.pe.transform(matrix), this.ticks, this.offset);
  }

  toJSON() {
    return { ...this, ps: { ...this.ps }, pe: { ...this.pe } };
  }
}

module.exports = DimString;
