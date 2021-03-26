const flatten = require('@flatten-js/core');
const { normalize, matches } = require('../../utility/arguments');
const Point = require('./point');


class Segment extends flatten.Segment {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'point')) {
      const [start, end] = args;
      return super(flatten.point(...start), flatten.point(...end));
    }

    if (matches(args, 'segment')) {
      const segment = args[0];
      return Segment.from_segment(segment);
    }

    if (matches(args, 'segment', 'point')) {
      const [segment, point] = args;
      return Segment.from_perpendicular(segment, point);
    }

    return super(...args);
  }

  static from_points(start, end) {
    [start, end] = normalize([start, end]);
    return new Segment(start, end);
  }

  static from_segment(segment) {
    [segment] = normalize([segment]);
    return new Segment(...segment);
  }

  static from_perpendicular(segment, point) {
    // normalize arguments
    [segment, point] = normalize([segment, point]);
    point = new Point(...point);
    segment = new Segment(...segment);

    // create perpendicular segment
    const start = point.projectionOn(flatten.line(segment.start, segment.end));
    const perpendicular = new Segment(start, point);

    // shift perpendicular onto line segment if its projection is off segment
    const distance = segment.distanceTo(start)[1];
    const shift = flatten.vector(distance.end, distance.start);
    const final = perpendicular.translate(shift);

    return new Segment(final);
  }
}


module.exports = Segment;
