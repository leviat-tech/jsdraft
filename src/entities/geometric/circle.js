const flatten = require('@flatten-js/core');
const Point = require('./point');
const Segment = require('./segment');
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
      return Circle.from_three_points(a, b, c);
    }

    if (matches(args, 'segment', 'segment', 'number')) {
      const [tan_a, tan_b, radius] = args;
      return Circle.from_tangents(tan_a, tan_b, radius);
    }

    return super(...args);
  }

  static from_center_radius(center, radius) {
    return new Circle(center, radius);
  }

  static from_two_points(a, b) {
    const bisect = new Segment(...a, ...b);
    const center = bisect.middle();
    const radius = center.distanceTo(flatten.point(...a))[0];
    return new Circle(center, radius);
  }

  static from_three_points(a, b, c) {
    [a, b, c] = [a, b, c].map((x) => flatten.point(...x));
    const mid_a_b = flatten.segment(a, b).middle();
    const mid_a_c = flatten.segment(a, c).middle();
    const norm_a_b = flatten.line(a, b).norm;
    const norm_a_c = flatten.line(a, c).norm;
    const bisect_a_b = flatten.line(mid_a_b, mid_a_b.translate(norm_a_b));
    const bisect_a_c = flatten.line(mid_a_c, mid_a_c.translate(norm_a_c));
    const center = bisect_a_b.intersect(bisect_a_c)[0];
    const radius = center.distanceTo(a)[0];
    return new Circle(center, radius);
  }

  static from_tangents(a, b, radius) {
    [a, b] = [a, b].map((x) => new Segment(x));
    const i = a.intersect(b)[0];
    const va = flatten.vector(i, a.start).normalize();
    const vb = flatten.vector(i, b.start).normalize();
    const bisect = flatten.vector(i, flatten.segment(a.start, b.start).middle()).normalize();
    const theta = Math.acos(va.dot(vb)) / 2.0; // va.angleTo(vb) / 2.0
    const hypotenuse = radius / Math.sin(theta);
    const center = i.translate(bisect.multiply(hypotenuse));
    return new Circle(center, radius);
  }

  get radius() {
    return (this.box.xmax - this.box.xmin) / 2;
  }

  get center() {
    const r = this.radius;
    return new Point(this.box.xmin + r, this.box.ymin + r);
  }
}


module.exports = Circle;
