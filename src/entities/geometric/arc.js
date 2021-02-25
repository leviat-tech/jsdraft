const flatten = require('@flatten-js/core');
const { normalize, matches } = require('../../utility/arguments');


class Arc extends flatten.Arc {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'number', 'number', 'number', '...')) {
      const [center, radius, start, end, cc] = args;
      return super(flatten.point(...center), radius, start, end, cc);
    }

    if (matches(args, 'point', 'point', 'number', '...')) {
      const [center, start, angle, cc] = args;
      return Arc.from_center_start(center, start, angle, cc);
    }

    if (matches(args, 'point', 'point', 'point')) {
      const [start, through, end] = args;
      return Arc.from_through_point(start, through, end);
    }

    if (matches(args, 'point', 'number', 'point')) {
      const [start, bulge, end] = args;
      return Arc.from_bulge(start, bulge, end);
    }

    if (matches('segment', 'segment', 'number', '...')) {
      const [tan_a, tab_b, radius, side] = args;
      return Arc.from_tangents(tan_a, tab_b, radius, side);
    }
  }

  static from_center_radius(center, radius, start, end, cc) {
    return new Arc(center, radius, start, end, cc);
  }

  static from_center_start(center, start, angle, cc) {
    return new Arc(center, start, angle, cc);
  }

  static from_through_point(start, through, end) {
    return new Arc(start, through, end);
  }

  static from_bulge(start, bulge, end) {
    return new Arc(start, bulge, end);
  }

  static from_tangents(tan_a, tab_b, radius, side) {
    return new Arc(tan_a, tab_b, radius, side);
  }

}


module.exports = Arc;
