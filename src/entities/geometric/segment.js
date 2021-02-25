const flatten = require('@flatten-js/core');
const { normalize, matches } = require('../../utility/arguments');


class Segment extends flatten.Segment {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'point')) {
      const [start, end] = args;
      return super(flatten.point(...start), flatten.point(...end));
    }

    if (matches(args, 'segment', 'number')) {
      const [segment, number] = args;
      return Segment.from_perpendicular(segment, number);
    }
  }

  static from_points(start, end) {
    return new Segment(start, end);
  }

  static from_perpendicular(segment, point) {
    return new Segment(segment, point);
  }
}


module.exports = Segment;
