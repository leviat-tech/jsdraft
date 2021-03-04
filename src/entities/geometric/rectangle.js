const flatten = require('@flatten-js/core');
const Point = require('./point');
const Segment = require('./segment');
const Polyface = require('./polyface');
const { normalize, matches } = require('../../utility/arguments');


class Rectangle extends Polyface {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'number', 'number', 'number', 'number')) {
      const [xmin, ymin, xmax, ymax] = args;
      return super(flatten.box(xmin, ymin, xmax, ymax));
    }

    if (matches(args, 'point', 'number', 'number')) {
      const [origin, width, height] = args;
      return Rectangle.from_origin(origin, width, height);
    }

    if (matches(args, 'point', 'point')) {
      const [start, end] = args;
      return Rectangle.from_corners(start, end);
    }

    if (matches(args, 'segment', 'number')) {
      const [a, b, height] = args;
      return Rectangle.from_edge(a, b, height);
    }

    return super(...args);
  }

  static from_boundaries(xmin, ymin, xmax, ymax) {
    return new Rectangle(xmin, ymin, xmax, ymax);
  }

  static from_origin(origin, width, height) {
    origin = new Point(...origin);
    return new Rectangle(origin.x, origin.y, origin.x + width, origin.y + height);
  }

  static from_corners(start, end) {
    start = new Point(...start);
    end = new Point(...end);
    return new Rectangle(start.x, start.y, end.x, end.y);
  }

  static from_edge(edge, height) {
    const near = new Segment(edge);
    const norm = flatten.line(near.start, near.end).norm;
    const far = near.translate(norm.multiply(height));
    return new Rectangle(near.start.x, near.start.y, far.end.x, far.end.y);
  }

  get xmin() {
    return this.box.xmin;
  }

  get xmax() {
    return this.box.xmax;
  }

  get ymin() {
    return this.box.ymin;
  }

  get ymax() {
    return this.box.ymax;
  }
}


module.exports = Rectangle;
