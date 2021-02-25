const flatten = require('@flatten-js/core');
const Polyface = require('./polyface');
const { normalize, matches } = require('../../utility/arguments');


class Circle extends Polyface {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'point', 'number')) {
      const [center, radius] = args;
      return super(flatten.circle(flatten.point(...center), radius));
    }

    if (matches(args, 'point', 'point')) {
      const [a, b] = args;
      return Circle.from_two_points(a, b);
    }

    if (matches(args, 'point', 'point', 'point')) {
      const [a, b, c] = args;
      return Circle.from_two_points(a, b, c);
    }

    if (matches(args, 'segment', 'segment', 'number')) {
      const [tan_a, tan_b, radius] = args;
      return Circle.from_two_points(tan_a, tan_b, radius);
    }
  }

  static from_center_radius(center, radius) {
    return new Circle(center, radius);
  }

  static from_two_points(a, b) {
    return new Circle(a, b);
  }

  static from_three_points(a, b, c) {
    return new Circle(a, b, c);
  }

  static from_tangents(tan_a, tan_b, radius) {
    return new Circle(tan_a, tan_b, radius);
  }
}


module.exports = Circle;
