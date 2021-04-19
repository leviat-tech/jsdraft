const flatten = require('@flatten-js/core');
const Polyface = require('../../entities/geometric/polyface');

// union all polyface entities in sketch and ..args (if arg not a sketch assume its a polyface entity)
module.exports = function union(sketch, ...args) {
  const polyfaces = sketch.polyfaces.concat(...args.map((a) => a.polyfaces || [a]));
  const unioned = polyfaces.reduce((a, b) => flatten.BooleanOperations.unify(a, b));
  const rewound = new Polyface(flatten.polygon([...unioned.edges].map((e) => e.shape)));
  return sketch.create({ entity: rewound, style: sketch.node.style });
};
