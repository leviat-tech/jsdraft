const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const evaluate = require('../utility/misc/evaluate');


const DEFAULT_CONTEXT = {
  PI: Math.PI,
  abs: Math.abs,
  acos: Math.acos,
  asin: Math.asin,
  atan: Math.atan,
  atan2: Math.atan2,
  cbrt: Math.cbrt,
  ceil: Math.ceil,
  cos: Math.cos,
  floor: Math.floor,
  max: Math.max,
  min: Math.min,
  pow: Math.pow,
  round: Math.round,
  sign: Math.sign,
  sin: Math.sin,
  sqrt: Math.sqrt,
  tan: Math.tan,
};


// extract the key from a single label yaml object
function unwind(obj) {
  if (typeof obj === 'string') return obj;
  return Object.keys(obj)[0];
}

// evaluate YAML argument
function evaluate_argument(arg, scope) {
  if (Array.isArray(arg)) {
    return arg.map((a) => evaluate_argument(a, scope));
  }

  if (typeof arg === 'object') {
    return Object.entries(arg)
      .reduce((obj, [key, a]) => {
        obj[key] = evaluate_argument(a, scope);
        return obj;
      }, {});
  }

  if (typeof arg === 'string') return evaluate(arg, scope);

  return arg;
}

// evaluate yaml chain expression
function chain(sketch, exp, context) {
  let s = sketch.new;

  exp.forEach((x) => {
    const func = unwind(x);

    // 'sketch' keyword becomes a new chain
    if (func === 'sketch') {
      s = chain(s, x[func], context);

    // A sole feature name is executed with no arguments
    } else if (typeof x === 'string') {
      s = s[func]();

    // otherwise we have a standard sketch function
    } else {
      const args = evaluate_argument(x[func], context);
      s = s[func](...(Array.isArray(args) ? args : [args]));
    }
  });

  return sketch.add(s);
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

    // check if reference is a sketch
    const match = id.match(/(.+):sketch/);
    if (match) {
      refs[match[1]] = chain(sketch.new, exp, { ...DEFAULT_CONTEXT, ...context, ...refs });

      // otherwise evaluate as typical argument
    } else {
      refs[id] = evaluate_argument(exp, { ...DEFAULT_CONTEXT, ...context, ...refs });
    }
  });

  return refs;
}

// create a draft function from yaml definition and function name
function parse(draft, identifier) {
  draft = yaml.load(draft);
  const func = function feature(sketch, ...args) {
    // define context
    let context = {};

    // load parameters
    context = { ...context, ...parameters(draft.parameters ?? [], args) };

    // evaluate reference
    context = { ...context, ...reference(draft.reference ?? [], sketch, context) };

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
    const doc = fs.readFileSync(file, 'utf8');
    return parse(doc, identifier);
  } catch (e) {
    throw new Error(`Invalid yaml sketch: ${file} ${e}`);
  }
}

module.exports = { load, parse };
