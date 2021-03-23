const fs = require('fs');
const path = require('path');
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
      return original(sketch, ...validate(def.parameters, args));
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
    const identifier = path.basename(file, path.extname(file));
    const doc = fs.readFileSync(file, 'utf8');
    return parse(doc, identifier);
  } catch (e) {
    throw new Error(`Invalid js sketch: ${file} ${e}`);
  }
}

module.exports = { decorate, load, parse };
