const RBush = require('rbush');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const intersect_polycurve = require('../../utility/geometry/intersect-polycurve.js');


const fuzz = 5e-9;

function uniq(intersections) {
  const tree = new RBush();
  intersections.forEach((pt) => {
    const exists = tree.collides({
      minX: pt.x - fuzz,
      minY: pt.y - fuzz,
      maxX: pt.x + fuzz,
      maxY: pt.y + fuzz,
    });

    if (!exists) {
      tree.insert({ minX: pt.x, maxX: pt.x, minY: pt.y, maxY: pt.y, pt });
    }
  });

  return tree.all().map((item) => item.pt);
}

module.exports = function intersect(sketch, intersected) {
  const a = [];
  const hidden = [];

  for (const s of sketch.tree('partition')) {
    if (s.node.hidden) {
      hidden.push(s);
    } else if (s.node.entity
      && ['polycurve', 'polyface', 'arc', 'segment'].includes(base_entity_type(s.node.entity))
    ) {
      a.push(s.node.entity);
    }
  }

  const b = intersected.entities
    .filter((e) => ['polycurve', 'polyface', 'arc', 'segment'].includes(base_entity_type(e)));

  const intersections = a.reduce((i, entity) => {
    const a_type = base_entity_type(entity);

    b.forEach((e) => {
      const b_type = base_entity_type(e);

      if (a_type === 'polycurve') {
        i.push(...uniq(intersect_polycurve(entity, e)));
      } else if (b_type === 'polycurve') {
        i.push(...uniq(intersect_polycurve(e, entity)));
      } else {
        i.push(...uniq(entity.intersect(e)));
      }

    });

    return i;
  }, []);

  return sketch.new.add(...hidden, ...intersections);
};
