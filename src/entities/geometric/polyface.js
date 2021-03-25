const flatten = require('@flatten-js/core');
const { normalize, every, matches } = require('../../utility/arguments');
const Polycurve = require('./polycurve.js');
const Arc = require('./arc.js');
const fillet_points_to_segments = require('../../utility/geometry/fillet-points-to-segments.js');
const points_are_near = require('../../utility/geometry/points-are-near.js');
const svg_string = require('../../utility/misc/svg-string');


// Modifying prototype in the event that a user wants to render an
// entity obtained through flatten.js methods.
flatten.Polygon.prototype.svg = function svg(styles) {
  let d = '';
  for (const face of this.faces) { d += face.svg(); }

  const attributes = {
    ...styles,
    d,
  };

  return svg_string('path', attributes);
};


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

  static from_polycurve(polycurve, bulge = 0) {
    const p = new Polyface();
    const vertices = polycurve.vertices;
    const should_add_segment = !points_are_near(vertices[0], vertices[vertices.length - 1]);
    const face = polycurve.toShapes();
    if (bulge && should_add_segment) {
      const closing = new Arc(vertices[vertices.length - 1], bulge, vertices[0]);
      face.push(closing);
    } else if (should_add_segment) {
      const closing = flatten.segment(vertices[vertices.length - 1], vertices[0]);
      face.push(closing);
    }
    p.addFace(face);
    return p;
  }

  static from_fillet(...points) {
    const segs = fillet_points_to_segments(points, true);
    return this.from_segments(...segs);
  }

  static from_bulge(...args) {
    // get bulge property of closing segment
    const bulge = typeof args[args.length - 1] === 'number' ? args[args.length - 1] : 0;
    return this.from_polycurve(new Polycurve(...args), bulge);
  }

  static from_segments(...segs) {
    return this.from_polycurve(new Polycurve(...segs));
  }
}


module.exports = Polyface;
