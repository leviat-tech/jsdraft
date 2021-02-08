import Point from './point.js';


class PolylinePoint {
  constructor(point, fillet) {
    this.point = point;
    this.fillet = fillet;
  }

  static cast(pt) {
    if (pt instanceof PolylinePoint) return pt;

    // point
    if (pt instanceof Point) {
      return new PolylinePoint(pt, 0);
    }

    // { x, y }
    const point_arg = Point.cast(pt);
    if (point_arg) {
      return new PolylinePoint(point_arg, 0);
    }

    // [point, fillet]
    if (Array.isArray(pt)) {
      const point = Point.cast(pt[0]);
      const fillet = pt[1] === undefined ? 0 : Number(pt[1]);

      if (point && !Number.isNaN(fillet)) return new PolylinePoint(point, fillet);
    }

    // { point, fillet }
    if (typeof pt === 'object' && pt !== null) {
      const point = Point.cast(pt.point);
      const fillet = pt.fillet === undefined ? 0 : Number(pt.fillet);

      if (point && !Number.isNaN(fillet)) return new PolylinePoint(point, fillet);
    }

    return null;
  }
}

export default PolylinePoint;
