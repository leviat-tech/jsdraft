const flatten = require('@flatten-js/core');


// union all polyface entities in sketch and ..args (if arg not a sketch assume its a polyface entity)
module.exports = function union(sketch, ...args) {
  const polyfaces = sketch.polyfaces.concat(...args.map((a) => a.polyfaces || [a]));
  const unioned = polyfaces.reduce((a, b) => flatten.BooleanOperations.unify(a, b));
  return sketch.create({ entity: unioned });
};
