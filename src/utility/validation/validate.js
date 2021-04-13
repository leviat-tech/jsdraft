const confirm = require('./confirm');
const convert = require('./convert');


function validate(defs, args, sketch) {
  const validated = [];

  // check that parameter defitions and arguments match in number
  // if (defs.length !== args.length) {
  //   throw new RangeError(`Expected number of arguments ${args.length} to match parameter definition ${defs.length}`);
  // }

  defs.forEach((def, i) => {
    let arg = args[i];

    // set default
    arg = arg ?? def.default;

    // check type
    if (def.type !== undefined && !confirm(arg, def.type, sketch)) {
      throw new TypeError(`Expected argument type ${typeof arg}/${arg.constructor.name} to be of type ${def.type}`);
    }

    // coerce type
    if (def.cast !== undefined) {
      arg = convert(arg, def.cast, sketch);
    }

    // save validated argument
    validated.push(arg);
  });

  return validated;
}

module.exports = validate;
