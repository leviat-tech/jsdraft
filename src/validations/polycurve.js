import Polycurve from '../entities/polycurve.js';


function polycurve(parameter, arg) {
  const polycrv = Polycurve.cast(arg);
  if (polycrv) return polycrv;

  throw new Error('Invalid polycurve definition');
}

export default polycurve;
