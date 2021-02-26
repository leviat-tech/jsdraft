const flatten = require('@flatten-js/core');
const { matches } = require('./matches');


function normalize(args) {
  if (!Array.isArray(args)) {
    return args;
  }
  if (matches([args], 'point')) {
    return flatten.point(...args);
  }
  if (matches([args], 'segment')) {
    return flatten.segment(flatten.point(...args[0]), flatten.point(...args[1]));
  }
  if (matches([args], 'arc')) {
    return flatten.arc(flatten.point(...args[0]), ...args.slice(1));
  }
  return args;
}

module.exports = normalize;
