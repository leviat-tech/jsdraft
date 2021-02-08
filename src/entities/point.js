class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = 'point';
  }

  // Attempts to cast to point, otherwise returns null
  static cast(pt) {
    if (pt instanceof Point) return pt;

    // [x, y]
    if (Array.isArray(pt)) {
      const x = Number(pt[0]);
      const y = Number(pt[1]);
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        return new Point(x, y);
      }
    }

    // { x, y }
    if (typeof pt === 'object' && pt !== null) {
      const x = Number(pt.x);
      const y = Number(pt.y);
      if (!Number.isNaN(x) && !Number.isNaN(y)) {
        return new Point(x, y);
      }
    }

    return null;
  }
}

export default Point;
