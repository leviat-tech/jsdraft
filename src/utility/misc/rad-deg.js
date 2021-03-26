function deg_to_rad(deg) {
  return deg * (Math.PI / 180);
}

function rad_to_deg(rad) {
  return rad * (180 / Math.PI);
}

module.exports = { deg_to_rad, rad_to_deg };
