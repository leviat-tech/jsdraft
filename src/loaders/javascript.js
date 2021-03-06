const fs = require('fs');
const path = require('path');
const evaluate = require('../utility/misc/evaluate');


function parse(contents, identifier) {
  const func = evaluate(contents.trim());
  func.identifier = identifier;
  return func;
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
