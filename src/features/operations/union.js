const flatten = require('@flatten-js/core');
const polyface_orientation = require('../../utility/geometry/polyface-orientation.js');
const { base_entity_type } = require('../../utility/misc/entity-type.js');


// union all polyface entities in sketch and ..args (if arg not a sketch assume its a polyface entity)
module.exports = function union(sketch, ...args) {
  const sketch_polyfaces = [];
  const hidden = [];

  for (const s of sketch.tree('partition')) {
    if (s.node.hidden) {
      hidden.push(s);
    } else if (s.node.entity && base_entity_type(s.node.entity) === 'polyface') {
      sketch_polyfaces.push(s.node.entity);
    }
  }

  const polyfaces = sketch_polyfaces.concat(...args.map((a) => a.polyfaces || [a]));
  if (polyfaces.length < 2) throw new Error('At least two polyfaces must be supplied to union');

  const first = polyfaces[0];
  if (polyface_orientation(first) !== -1) first.reverse();

  const unioned = polyfaces.reduce((a, b) => {
    // Ensure that all polyfaces are oriented uniformly
    if (polyface_orientation(b) !== -1) b.reverse();

    return flatten.BooleanOperations.unify(a, b);
  });

  if (hidden.length > 0) {
    return sketch.new.add(
      ...hidden,
      sketch.create({ entity: unioned, style: sketch.node.style }),
    );
  }

  return sketch.create({ entity: unioned, style: sketch.node.style });
};
