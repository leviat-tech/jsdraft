const flatten = require('@flatten-js/core');
const { normalize, every, matches } = require('../../utility/arguments');
const Polycurve = require('./polycurve.js');
const Arc = require('./arc.js');
const fillet_points_to_segments = require('../../utility/geometry/fillet-points-to-segments.js');
const points_are_near = require('../../utility/geometry/points-are-near.js');
const { matches_fillet_point } = require('../../utility/arguments/matches');
const { numeric_array } = require('../../utility/arguments/numeric');


class Polyface extends flatten.Polygon {
  constructor(...args) {
    args = normalize(args);

    if (matches(args, 'polyface')) {
      return Polyface.from_polyface(...args);
    }

    if (matches(args, 'polycurve', '...')) {
      return Polyface.from_polycurve(...args);
    }

    if (every(args, 'point or number or fillet_pt')) {
      return Polyface.from_points(...args);
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

  static from_points(...args) {
    const points = [];
    let adding_bulge = false;
    args.forEach((arg) => {

      // arg is a fillet point
      if (matches_fillet_point(arg)) {
        points.push({ point: arg[0], fillet: arg[1] });

      // arg is a point
      } else if (numeric_array(arg, { eq: 2 })) {
        if (adding_bulge) {
          points[points.length - 1].point = arg;
          adding_bulge = false;
        } else {
          points.push({ point: arg });
        }

      // arg is a bulge
      } else {
        points.push({ bulge: arg });
        adding_bulge = true;
      }
    });

    if (adding_bulge) {
      points[0].bulge = points[points.length - 1].bulge;
      points.pop();
    }

    const segs = fillet_points_to_segments(points, true);

    const p = new Polyface();
    p.addFace(segs);
    return p;
  }

  static from_segments(...segs) {
    return this.from_polycurve(new Polycurve(...segs));
  }
}


module.exports = Polyface;
