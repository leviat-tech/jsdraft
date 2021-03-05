const Vector = require('@crhio/vector').default;


// Takes three points and a radius and returns a curve of the filleted segment
function fillet(point_a, point_b, point_c, radius) {
  const a = Vector({ x: point_a[0], y: point_a[1] });
  const b = Vector({ x: point_b[0], y: point_b[1] });
  const c = Vector({ x: point_c[0], y: point_c[1] });

  const vec_0 = b.subtract(a).normalize();
  const vec_1 = c.subtract(b).normalize();
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
  const fillet_pt_a = b.subtract(vec_0.scale(ltt));
  const fillet_pt_b = b.add(vec_1.scale(ltt));

  // compute "bulge" property
  const l = fillet_pt_a.dist(fillet_pt_b) / 2;
  const sagitta = radius - Math.sqrt(radius * radius - l * l);
  const s_sign = (turn_angle) > 0 ? 1 : -1;
  const bulge = s_sign * (sagitta / l);

  return {
    point_a: [fillet_pt_a.x, fillet_pt_a.y],
    point_b: [fillet_pt_b.x, fillet_pt_b.y],
    bulge,
  };
}

module.exports = fillet;
