import Point from '../entities/point.js';


function point(parameter, arg) {
  const pt = Point.cast(arg);
  if (pt) return pt;

  throw new Error('Invalid point definition');
}

export default point;
