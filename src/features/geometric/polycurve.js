const Polycurve = require('../../entities/geometric/polycurve.js');


module.exports = function polycurve(sketch, ...args) {
  return sketch.add_entities(new Polycurve(...args));
};
