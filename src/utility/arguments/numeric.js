function numeric_array(args, options) {
  options = options || {};
  if (!Array.isArray(args)) return false;
  if (args.some((a) => typeof a !== 'number')) return false;
  if (options.eq && args.length !== options.eq) return false;
  if (options.min && args.length < options.min) return false;
  if (options.max && args.length > options.max) return false;
  return true;
}

function numeric_arrays(args, options) {
  options = options || {};
  if (!Array.isArray(args)) return false;
  if (args.length === 0) return false;
  for (arg of args) {
    if (!numeric_array(arg, options)) return false;
  }
  return true;
}

function nested_numeric_arrays(args, options) {
  const flatten = (a) => a.reduce((f, n) => f.concat(n), []);
  if (args.some((a) => !Array.isArray(a) || !a.some((e) => Array.isArray(e)))) return false;
  return numeric_arrays(args.map(flatten), options);
}

module.exports = { numeric_array, numeric_arrays, nested_numeric_arrays };
