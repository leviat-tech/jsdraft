const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const evaluate = require('../utility/misc/evaluate.js');
const { normalize_yaml_param } = require('./parameters.js');
const validate = require('../utility/validation/validate.js');
const convert = require('../utility/validation/convert.js');


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
    const func_name = unwind(x);
    const is_user_sketch = func_name.match(/^user\.(.+)$/);

    // 'sketch' keyword becomes a new chain
    if (func_name === 'sketch') {
      s = chain(s, x.sketch, context);

    // A sole feature name is executed with no arguments
    } else if (typeof x === 'string') {
      s = is_user_sketch
        ? s = s.user[is_user_sketch[1]]()
        : s = s[func_name]();

    // otherwise we have a standard sketch function
    } else {
      const args = evaluate_argument(x[func_name], context);

      s = is_user_sketch
        ? s.user[is_user_sketch[1]](...(Array.isArray(args) ? args : [args]))
        : s[func_name](...(Array.isArray(args) ? args : [args]));
    }
  });

  return sketch.add(s);
}

// parse draft yaml parameter definition
function parameters(definition, sketch, args) {
  const params = {};

  const normalized = definition
    .map((param) => normalize_yaml_param(param));

  const validated = validate(normalized, args, sketch);

  normalized.forEach((param, i) => {
    // get parameter value
    const val = validated[i];

    // store parameter
    params[param.name] = val;
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

    // check if reference should cast to a type
    const match = id.match(/(.+):(.+)/);
    if (match && match[2] === 'sketch') {
      // Sketch types should evaluate as a chain
      refs[match[1]] = chain(sketch.new, exp, { ...context, ...refs });

    } else if (match) {
      const type = match[2];

      const evaluated = evaluate_argument(exp, { ...context, ...refs });
      refs[match[1]] = convert(evaluated, type, sketch);

      // otherwise evaluate as typical argument
    } else {
      refs[id] = evaluate_argument(exp, { ...context, ...refs });
    }
  });

  return refs;
}

// create a draft function from yaml definition and function name
function parse(draft, identifier) {
  draft = yaml.load(draft);
  const func = function feature(sketch, ...args) {
    // define context
    let context = { ...DEFAULT_CONTEXT };

    // load parameters
    context = { ...context, ...parameters(draft.parameters ?? [], sketch, args) };

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
