const flatten = require('@flatten-js/core');
const { normalize, matches } = require('../../utility/arguments');


class Polyface extends flatten.Polygon {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, '...', 'point', '<number>')) {
      return super();
    }

    if (matches(args, '...', 'point and number')) {
      return Polyface.from_bulge();
    }

    if (matches(args, '...', 'segment or arc')) {
      return Polyface.from_segments();
    }
  }

  static from_fillet(center, radius) {
    return new Polyface(center, radius);
  }

  static from_bulge(a, b) {
    return new Polyface(a, b);
  }

  static from_segments(a, b, c) {
    return new Polyface(a, b, c);
  }

  static from_shapes(a, b, c) {
    return new Polyface(a, b, c);
  }
}


module.exports = Polyface;
