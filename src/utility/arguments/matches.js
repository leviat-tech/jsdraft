const flatten = require('@flatten-js/core');
const { numeric_array, numeric_arrays } = require('./numeric');


function matches_segment_array(arg) {
  return numeric_arrays(arg, { eq: 2 });
}

function matches_arc_array(arg) {
  return Array.isArray(arg)
  && arg.length >= 4
  && arg.length <= 5
  && numeric_array(arg[0])
  && numeric_array(arg.slice(1, 4));
}

function test(actual, expected) {
  if (expected && expected.indexOf(' or ') > -1) {
    return expected.split(' or ').map((e) => e.trim()).some((e) => test(actual, e));
  }
  if (expected === 'point') {
    return actual instanceof flatten.Point || numeric_array(actual, { eq: 2 });
  }
  if (expected === 'segment') {
    return actual instanceof flatten.Segment || matches_segment_array(actual);
  }
  if (expected === 'arc') {
    return (actual instanceof flatten.Arc) || matches_arc_array(actual);
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
  if (Array.isArray(pattern)) {
    return args.every((arg) => Array.isArray(arg) && matches(arg, ...pattern));
  }

  return args.every((arg) => test(arg, pattern));
}


module.exports = { matches, every, matches_segment_array, matches_arc_array };
