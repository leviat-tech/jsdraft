const flatten = require('@flatten-js/core');
const { normalize, matches } = require('../../utility/arguments');
const Point = require('./point');
const { style_to_svg, DEFAULT_ATTRIBUTES } = require('../../utility/misc/svg-style');
const svg_string = require('../../utility/misc/svg-string');


// Modifying prototype in the event that a user wants to render an
// entity obtained through flatten.js methods.
flatten.Segment.prototype.svg = function svg(styles = {}) {
  const d = `M${this.start.x},${this.start.y} L${this.end.x},${this.end.y}`;
  const attributes = {
    ...DEFAULT_ATTRIBUTES,
    ...style_to_svg(styles),
    d,
  };

  return svg_string('path', attributes);
};


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
