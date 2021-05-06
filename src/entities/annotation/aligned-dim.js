const flatten = require('@flatten-js/core');
const Point = require('../geometric/point.js');
const { normalize } = require('../../utility/arguments');


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

  get box() {
    return {
      xmin: Math.min(this.ps.x, this.pe.x),
      xmax: Math.max(this.ps.x, this.pe.x),
      ymin: Math.min(this.ps.y, this.pe.y),
      ymax: Math.max(this.ps.y, this.pe.y),
    };
  }

  transform(matrix = new flatten.Matrix()) {
    return new AlignedDim(this.ps.transform(matrix), this.pe.transform(matrix), this.side);
  }
}

module.exports = AlignedDim;
