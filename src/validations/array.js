import command from './command.js';
import curve from './curve.js';
import enum_type from './enum.js';
import number from './number.js';
import point from './point.js';
import polycurve from './polycurve.js';
import polyline_point from './polyline-point.js';
import string from './string.js';


function array(parameter, arg) {
  if (!Array.isArray(arg)) throw new Error('Invalid array');

  if (parameter.items) {
    const item_schema = parameter.items;

    const validate_item = {
      array: (item) => array(item_schema, item),
      command: (item) => command(item_schema, item),
      curve: (item) => curve(item_schema, item),
      enum: (item) => enum_type(item_schema, item),
      number: (item) => number(item_schema, item),
      point: (item) => point(item_schema, item),
      polycurve: (item) => polycurve(item_schema, item),
      polyline_point: (item) => polyline_point(item_schema, item),
      string: (item) => string(item_schema, item),
    }[item_schema.type];

    return arg.map((item) => validate_item(item));
  }

  return arg;
}

export default array;
