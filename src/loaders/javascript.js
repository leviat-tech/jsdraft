const load_file = require('./load-file.js');
const evaluate = require('../utility/misc/evaluate');
const validate = require('../utility/validation/validate');


function decorate(def, identifier) {
  const result = typeof def === 'function'
    ? { func: def }
    : { ...def };

  // decorate with parameter validation if provided
  if (result.parameters) {
    const original = result.func;
    result.func = function feature(sketch, ...args) {
      return original(sketch, ...validate(def.parameters, args, sketch));
    };
  }

  // set feature function identifier
  result.func.identifier = identifier ?? result.name ?? result.func.name;

  return result.func;
}

function parse(contents, identifier) {
  const def = evaluate(contents.trim());

  return decorate(def, identifier);
}

function load(file) {
  try {
    const { doc, identifier } = load_file(file);
    return parse(doc, identifier);
  } catch (e) {
    throw new Error(`Invalid js sketch: ${file} ${e}`);
  }
}

module.exports = { decorate, load, parse };
