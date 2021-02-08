import Point from './point.js';


class Curve {
  constructor(
    point_a = new Point(0, 0),
    point_b = new Point(1, 0),
    bulge = 0,
  ) {
    this.point_a = Point.cast(point_a);
    this.point_b = Point.cast(point_b);
    this.bulge = bulge;
    this.type = 'curve';
  }

  // Attempts to cast to curve, otherwise returns null
  static cast(crv) {
    if (crv instanceof Curve) return crv;

    let point_a;
    let point_b;
    let bulge;

    // [point_a, point_b, bulge]
    if (Array.isArray(crv)) {
      point_a = Point.cast(crv[0]);
      point_b = Point.cast(crv[1]);
      bulge = crv[2] === undefined ? 0 : Number(crv[2]);

    // { point_a, point_b, bulge }
    } else if (typeof crv === 'object' && crv !== null) {
      point_a = Point.cast(crv.point_a);
      point_b = Point.cast(crv.point_b);
      bulge = crv.bulge === undefined ? 0 : Number(crv.bulge);
    }

    if (point_a && point_b && !Number.isNaN(bulge)) {
      return new Curve(point_a, point_b, bulge);
    }

    return null;
  }
}

export default Curve;
