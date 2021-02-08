import PolycurvePoint from './polycurve-point.js';


class Polycurve {
  constructor(points, closed = false) {
    this.points = points; // a "point": { point, bulge }
    this.closed = closed;
    this.type = 'polycurve';
  }

  // Attempts to cast to polycurve, otherwise returns null
  static cast(polycrv) {
    if (polycrv instanceof Polycurve) return polycrv;

    let points;
    let closed;

    // [points, closed]
    if (Array.isArray(polycrv)) {
      points = polycrv[0];
      closed = !!polycrv[1];

    // { points, closed }
    } else if (typeof polycrv === 'object' && polycrv !== null) {
      points = polycrv.points;
      closed = polycrv.closed;
    }

    if (Array.isArray(points)) {
      const pcrv_pts = points.map((p) => PolycurvePoint.cast(p));

      if (pcrv_pts.every((pt) => !!pt)) {
        return new Polycurve(pcrv_pts, closed);
      }
    }

    return null;
  }
}

export default Polycurve;
