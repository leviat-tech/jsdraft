const flatten = require('@flatten-js/core');


function normalize(args) {
  if (Array.isArray(args)) {
    return args.map((a) => normalize(a));
  }
  if (args instanceof flatten.Point) {
    return [args.x, args.y];
  }
  if (args instanceof flatten.Segment) {
    return [normalize(args.start), normalize(args.end)];
  }
  if (args instanceof flatten.Arc) {
    return [
      normalize(args.center),
      args.r,
      args.startAngle,
      args.endAngle,
      args.counterClockwise];
  }
  return args;
}

module.exports = normalize;
