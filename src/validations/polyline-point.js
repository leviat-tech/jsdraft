import PolylinePoint from '../entities/polyline-point.js';


function polyline_point(parameter, arg) {
  const p_pt = PolylinePoint.cast(arg);

  if (p_pt) return p_pt;

  throw new Error('Invalid polyline point');
}

export default polyline_point;
