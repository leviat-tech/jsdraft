const flatten = require('@flatten-js/core');
const Point = require('./point');
const Segment = require('./segment');
const Polyface = require('./polyface');
const { normalize, matches } = require('../../utility/arguments');


class Rectangle extends Polyface {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'number', 'number', 'number', 'number', '...')) {
      const [xmin, ymin, xmax, ymax, radius] = args;
      if (radius) {
        const pface = new Polyface(
          [[xmin, ymin], radius],
          [[xmax, ymin], radius],
          [[xmax, ymax], radius],
          [[xmin, ymax], radius],
        );

        super();
        this.faces = pface.faces;
        this.edges = pface.edges;

        // TODO: changing this radius property does not change the entity
        this.r = radius;
      } else {
        super(flatten.box(xmin, ymin, xmax, ymax));
        this.r = 0;
      }

      return undefined;
    }

    if (matches(args, 'point', 'number', 'number', '...')) {
      const [origin, width, height, radius] = args;
      return Rectangle.from_origin(origin, width, height, radius);
    }

    if (matches(args, 'point', 'point', '...')) {
      const [start, end, radius] = args;
      return Rectangle.from_corners(start, end, radius);
    }

    if (matches(args, 'segment', 'number', '...')) {
      const [a, b, height, radius] = args;
      return Rectangle.from_edge(a, b, height, radius);
    }

    super(...args);
  }

  get type() { return 'rectangle'; }

  static from_boundaries(xmin, ymin, xmax, ymax) {
    return new Rectangle(xmin, ymin, xmax, ymax);
  }

  static from_origin(origin, width, height, radius) {
    origin = new Point(...origin);
    return new Rectangle(origin.x, origin.y, origin.x + width, origin.y + height, radius);
  }

  static from_corners(start, end, radius) {
    start = new Point(...start);
    end = new Point(...end);
    return new Rectangle(start.x, start.y, end.x, end.y, radius);
  }

  static from_edge(edge, height, radius) {
    const near = new Segment(edge);
    const norm = flatten.line(near.start, near.end).norm;
    const far = near.translate(norm.multiply(height));
    return new Rectangle(near.start.x, near.start.y, far.end.x, far.end.y, radius);
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
