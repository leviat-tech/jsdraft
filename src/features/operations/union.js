const flatten = require('@flatten-js/core');
const polyface_orientation = require('../../utility/geometry/polyface-orientation.js');


// union all polyface entities in sketch and ..args (if arg not a sketch assume its a polyface entity)
module.exports = function union(sketch, ...args) {
  const polyfaces = sketch.polyfaces.concat(...args.map((a) => a.polyfaces || [a]));
  const unioned = polyfaces.reduce((a, b) => {
    // Ensure that all polyfaces are oriented uniformly
    if (polyface_orientation(b) !== -1) b.reverse();

    return flatten.BooleanOperations.unify(a, b);
  });
  return sketch.create({ entity: unioned, style: sketch.node.style });
};
