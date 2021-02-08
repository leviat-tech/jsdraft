import array from './array.js';
import command from './command.js';
import curve from './curve.js';
import enum_type from './enum.js';
import number from './number.js';
import point from './point.js';
import polycurve from './polycurve.js';
import polyline_point from './polyline-point.js';
import string from './string.js';


function validate(parameter, arg) {
  // undefined args will be assigned their default
  if (arg === undefined && parameter.default !== undefined) {
    if (typeof parameter.default === 'function') return parameter.default();
    return parameter.default;
  }

  // args will be validated and cast if necessary
  return {
    array: () => array(parameter, arg),
    command: () => command(parameter, arg),
    curve: () => curve(parameter, arg),
    enum: () => enum_type(parameter, arg),
    number: () => number(parameter, arg),
    point: () => point(parameter, arg),
    polycurve: () => polycurve(parameter, arg),
    polyline_point: () => polyline_point(parameter, arg),
    string: () => string(parameter, arg),
  }[parameter.type](parameter, arg);
}

export default validate;
