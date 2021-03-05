const flatten = require('@flatten-js/core');
const { normalize, every, matches } = require('../../utility/arguments');
const Polycurve = require('./polycurve.js');


class Polyface extends flatten.Polygon {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'polyface')) {
      return Polyface.from_polyface(...args);
    }

    if (matches(args, 'polycurve')) {
      return Polyface.from_polycurve(...args);
    }

    if (every(args, ['point', 'number'])) {
      return Polyface.from_fillet(...args);
    }

    if (every(args, 'point or number')) {
      return Polyface.from_bulge(...args);
    }

    if (every(args, 'segment or arc')) {
      return Polyface.from_segments(...args);
    }

    return super(...args);
  }

  static from_polyface(polyface) {
    const p = new Polyface();
    for (const face of polyface.faces) {
      p.addFace(face.shapes);
    }
    return p;
  }

  static from_polycurve(polycurve) {
    const p = new Polyface();
    const vertices = polycurve.vertices;
    const closing = flatten.segment(vertices[vertices.length - 1], vertices[0]);
    p.addFace([...polycurve.toShapes(), closing]);
    return p;
  }

  static from_fillet(...points) {
    return this.from_polycurve(new Polycurve(...points));
  }

  static from_bulge(...args) {
    return this.from_polycurve(new Polycurve(...args));
  }

  static from_segments(...segs) {
    return this.from_polycurve(new Polycurve(...segs));
  }
}


module.exports = Polyface;
