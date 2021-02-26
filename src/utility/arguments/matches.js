const flatten = require('@flatten-js/core');
const { numeric_array, numeric_arrays } = require('./numeric');


function test(actual, expected) {
  if (expected && expected.indexOf(' or ') > -1) {
    return expected.split(' or ').map((e) => e.trim()).some((e) => test(actual, e));
  }
  if (expected === 'point') {
    return actual instanceof flatten.Point || numeric_array(actual, { eq: 2 });
  }
  if (expected === 'segment') {
    return actual instanceof flatten.Segment || numeric_arrays(actual, { eq: 2 });
  }
  if (expected === 'arc') {
    return (actual instanceof flatten.Arc) || (
      Array.isArray(actual)
      && actual.length >= 3
      && actual.length <= 4
      && numeric_array(actual[0])
      && numeric_array(actual.slice(1, 3)));
  }
  return typeof (actual) === expected;
}

function matches(args, ...spec) {
  const trim = spec.indexOf('...');
  if (trim > 0) {
    args = args.slice(0, trim);
    spec = spec.slice(0, trim);
  }
  if (args.length !== spec.length) return false;
  return args.every((a, i) => test(a, spec[i]));
}

function every(args, pattern) {
  return args.every((arg) => Array.isArray(arg) && matches(arg, ...pattern));
}


module.exports = { matches, every };
