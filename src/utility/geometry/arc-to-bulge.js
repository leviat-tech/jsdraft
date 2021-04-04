function pos_angle(angle) {
  let a = angle % (2 * Math.PI);
  if (a < 0) a = 2 * Math.PI + a;
  return a;
}


function arc_to_bulge(start_angle, end_angle, ccw, divide) {
  let a = pos_angle(end_angle - start_angle);
  if (divide) a /= divide;
  const bulge = Math.abs(Math.tan(a / 4));
  const sign = ccw ? 1 : -1;

  return sign * bulge;
}

module.exports = arc_to_bulge;
