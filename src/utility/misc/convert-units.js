const units = {
  m: 1,
  cm: 100,
  mm: 1000,
  in: 39.3701,
  ft: 3.28084,
  yd: 1.09361,
  rad: 1,
  deg: 180 / Math.PI,
  kg: 1,
  g: 1000,
  oz: 35.274,
  lb: 2.20462,
};

module.exports = function convert_units(value, from, to = 'm') {
  return value * (units[to] / units[from]);
};
