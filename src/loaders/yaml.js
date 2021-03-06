const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const safe = require('notevil');


// WARNING: THIS IS INSECURE: USE SECURE PARSING AND EVALUATION TO PREVENT POISONED DRAFT FILES

// extract the key from a single label yaml object
function unwind(obj) {
  return Object.keys(obj)[0];
}

// evaluate yaml chain expression
function chain(sketch, exp, context) {
  let s = sketch.new;

  exp.forEach((x) => {
    const func = unwind(x);
    const args = x[func].map((a) => {
      if (typeof a === 'string' && a.startsWith('$')) {
        return safe(a, context);
      }
      return a;

    });
    s = s[func](...args);
  });

  return s;
}

// parse draft yaml parameter definition
function parameters(definition, args) {
  const params = {};

  definition.forEach((param, i) => {
    // get parameter name
    let name = param;
    if (typeof param === 'object') {
      name = unwind(param);
    }

    // get parameter definition
    let def = param[name];
    if (typeof def !== 'object') {
      def = {
        default: def,
      };
    }

    // get parameter value
    const val = args[i] ?? def.default;

    // store parameter
    params[name] = val;
  });

  return params;
}

// parse draft yaml constant definition
function reference(definition, sketch, context) {
  const refs = {};

  definition.forEach((constant) => {
    // get id and expression
    const id = unwind(constant);
    const exp = constant[id];

    // evaluate constant from vanilla js expression
    if (typeof exp === 'string') {
      refs[id] = safe(exp, { ...context, ...refs });
    }

    // evaluate constant from sketch chain expression
    if (Array.isArray(exp)) {
      refs[id] = chain(sketch, exp, { ...context, ...refs });
    }
  });

  return refs;
}

// create a draft function from yaml definition and function name
function parse(draft, identifier) {
  const func = function feature(sketch, ...args) {
    // define context
    let context = {};

    // load parameters
    context = { ...context, ...parameters(draft.parameters, args) };

    // evaluate reference
    context = { ...context, ...reference(draft.reference, sketch, context) };

    // evaluate sketch
    return chain(sketch, draft.sketch, context);
  };
  func.identifier = identifier;
  return func;
}

// load draft yaml function from file
function load(file) {
  try {
    const identifier = path.basename(file, path.extname(file));
    const doc = yaml.load(fs.readFileSync(file, 'utf8'));
    return parse(doc, identifier);
  } catch (e) {
    throw new Error(`Invalid yaml sketch: ${file} ${e}`);
  }
}

module.exports = { load };
