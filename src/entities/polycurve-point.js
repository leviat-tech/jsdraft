import Point from './point.js';


class PolycurvePoint {
  constructor(point, bulge = 0) {
    this.point = point;
    this.bulge = bulge;
    this.type = 'polycurve_point';
  }

  // Attempts to cast to polycurve point, otherwise returns null
  static cast(pcrv_pt) {
    if (pcrv_pt instanceof PolycurvePoint) return pcrv_pt;

    let point;
    let bulge;

    // [point, bulge]
    if (Array.isArray(pcrv_pt)) {
      point = Point.cast(pcrv_pt[0]);
      bulge = pcrv_pt[1] === undefined ? 0 : Number(pcrv_pt[1]);

    // { point, bulge }
    } else if (typeof pcrv_pt === 'object' && pcrv_pt !== null) {
      point = Point.cast(pcrv_pt.point);
      bulge = pcrv_pt.bulge === undefined ? 0 : Number(pcrv_pt.bulge);
    }

    if (point && !Number.isNaN(bulge)) return new PolycurvePoint(point, bulge);

    return null;
  }
}

export default PolycurvePoint;
