import Curve from '../entities/curve.js';


function curve(parameter, arg) {
  const crv = Curve.cast(arg);
  if (crv) return crv;

  throw new Error('Invalid curve definition');
}

export default curve;
