const flatten = require('@flatten-js/core');


function normalize(args) {
  if (Array.isArray(args)) {
    return args.map((a) => normalize(a));
  }
  if (args instanceof flatten.Point) {
    return [args.x, args.y];
  }
  return args;
}

module.exports = normalize;
