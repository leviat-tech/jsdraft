const flatten = require('@flatten-js/core');
const set = require('lodash/set');
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');
const orientation = require('../../utility/geometry/orientation.js');


class AlignedDim {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of two points for the start and end of the dimension:
      [[0, 0], [5, 5]]
    */

    this.ps = new Point(...args[0]);
    this.pe = new Point(...args[1]);

    if (Array.isArray(args[2])) {
      const offset_pt = new Point(...args[2]);
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
      this.offset = args[2];
    }

    // A callback can be defined which can be used to set overrides in app
    this.callback = typeof args[3] === 'string'
      ? (value) => set({}, args[3], value)
      : args[3];
  }

  get type() { return 'aligned_dim'; }

  get box() {
    return {
      xmin: Math.min(this.ps.x, this.pe.x),
      xmax: Math.max(this.ps.x, this.pe.x),
      ymin: Math.min(this.ps.y, this.pe.y),
      ymax: Math.max(this.ps.y, this.pe.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new AlignedDim(this.ps.transform(matrix), this.pe.transform(matrix), this.offset, this.callback);
  }

  toJSON() {
    return { ...this, ps: { ...this.ps }, pe: { ...this.pe } };
  }
}

module.exports = AlignedDim;
