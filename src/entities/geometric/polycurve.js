const flatten = require('@flatten-js/core');
const { normalize, every } = require('../../utility/arguments');


class Polycurve extends flatten.Multiline {
  constructor(...args) {
    args = normalize(args);

    if (every(args, ['point', '<number>'])) {
      return super();
    }

    if (every(args, ['point or number'])) {
      return Polycurve.from_bulge();
    }

    if (every(args, ['segment or arc'])) {
      return Polycurve.from_segments();
    }
  }

  static from_fillet(center, radius) {
    return new Polycurve(center, radius);
  }

  static from_bulge(a, b) {
    return new Polycurve(a, b);
  }

  static from_segments(a, b, c) {
    return new Polycurve(a, b, c);
  }
}


module.exports = Polycurve;
