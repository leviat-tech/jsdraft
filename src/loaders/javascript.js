const fs = require('fs');
const path = require('path');
const evaluate = require('../utility/misc/evaluate');


function parse(contents, identifier) {
  const result = evaluate(contents.trim());
  let func;
  let register = false;

  // result is a function
  if (typeof result === 'function') {
    func = result;

  // result is an object
  } else {
    register = !!result.register;
    func = result.func;
  }


  func.identifier = identifier;
  return { func, register };
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
