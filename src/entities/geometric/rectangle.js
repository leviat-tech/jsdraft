const flatten = require('@flatten-js/core');
const Polyface = require('./polyface');
const { normalize, matches } = require('../../utility/arguments');


class Rectangle extends Polyface {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'number', 'number')) {
      const [origin, width, height] = args;
      return super(flatten.point(...origin), width, height);
    }

    if (matches(args, 'point', 'point')) {
      const [start, end] = args;
      return Rectangle.from_corners(start, end);
    }

    if (matches(args, 'point', 'point', 'number')) {
      const [a, b, height] = args;
      return Rectangle.from_edge(a, b, height);
    }
  }

  static from_origin(origin, width, height) {
    return new Rectangle(origin, width, height);
  }

  static from_corners(start, end) {
    return new Rectangle(start, end);
  }

  static from_edge(a, b, height) {
    return new Rectangle(a, b, height);
  }
}


module.exports = Rectangle;
