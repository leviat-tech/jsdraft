import VectorObj from '@crhio/vector';
import Curve from '../entities/curve.js';


const Vector = VectorObj.default;

// Takes three points and a radius and returns a curve of the filleted segment
function fillet(point_a, point_b, point_c, radius) {
  const vec_0 = Vector(point_b).subtract(point_a).normalize();
  const vec_1 = Vector(point_c).subtract(point_b).normalize();
  const angle_0 = vec_0.angle();
  const angle_1 = vec_1.angle();
  const diff = angle_0 - angle_1;
  let turn_angle;
  if (diff < -Math.PI) {
    turn_angle = diff + Math.PI * 2;
  } else if (diff > Math.PI) {
    turn_angle = diff - Math.PI * 2;
  } else {
    turn_angle = diff;
  }
  const angle = vec_0.angleBetween(vec_1);
  const ltt = Math.abs(radius / Math.tan(angle / 2));
  const fillet_pt_a = Vector(point_b).add(vec_0.scale(ltt));
  const fillet_pt_b = Vector(point_b).add(vec_1.scale(ltt));

  // compute "bulge" property
  const l = fillet_pt_a.dist(fillet_pt_b) / 2;
  const sagitta = radius - Math.sqrt(radius * radius - l * l);
  const s_sign = (turn_angle) > 0 ? 1 : -1;
  const bulge = s_sign * (sagitta / l);

  return new Curve(fillet_pt_b, fillet_pt_b, bulge);
}

export default fillet;
