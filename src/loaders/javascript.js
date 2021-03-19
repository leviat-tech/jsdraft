const fs = require('fs');
const path = require('path');
const evaluate = require('../utility/misc/evaluate');
const validate = require('../utility/validation/validate');


function parse(contents, identifier) {
  let def = evaluate(contents.trim());

  // accept simple functions
  if (typeof def === 'function') {
    def = {
      func: def,
    };
  }

  // decorate with parameter validation if provided
  if (def.parameters) {
    const original = def.func;
    def.func = function feature(sketch, ...args) {
      return original(sketch, ...validate(def.parameters, args));
    };
  }

  // set feature function identifier
  def.func.identifier = identifier ?? def.name ?? def.func.name;

  return def.func;
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

module.exports = { load, parse };
