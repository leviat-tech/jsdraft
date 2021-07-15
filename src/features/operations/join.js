const RBush = require('rbush');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const points_are_near = require('../../utility/geometry/points-are-near.js');
const Polycurve = require('../../entities/geometric/polycurve.js');
const Polyface = require('../../entities/geometric/polyface.js');


const fuzz = 5e-9;

function find_leaf_node(node) {
  if (node.children && node.children.length > 0) return find_leaf_node(node.children[0]);
  return node;
}

function join_entities(a, b, jt) {
  // possible join types:
  //   - a_b: join endpoint of a to startpoint of b
  //   - a_brev: join endpoint of a to endpoint of b
  //   - b_a: join endpoint of b to startpoint of a
  //   - brev_a: join startpoint of a to startpoint of b

  const a_segs = base_entity_type(a) === 'polycurve' ? a.toShapes() : [a];
  let b_segs = base_entity_type(b) === 'polycurve' ? b.toShapes() : [b];

  let result;

  if (jt === 'a_b') {
    result = new Polycurve(...a_segs, ...b_segs);
  }

  if (jt === 'a_brev') {
    b_segs.reverse();
    b_segs = b_segs.map((seg) => seg.reverse());
    result = new Polycurve(...a_segs, ...b_segs);
  }

  if (jt === 'b_a') {
    result = new Polycurve(...b_segs, ...a_segs);
  }

  if (jt === 'brev_a') {
    b_segs.reverse();
    b_segs = b_segs.map((seg) => seg.reverse());
    result = new Polycurve(...b_segs, ...a_segs);
  }

  return result;
}

module.exports = function join(sketch) {
  // initialize spatial index
  const result = [];
  const hidden = [];
  const tree = new RBush();
  for (const s of sketch.tree('partition')) {
    if (s.node.hidden) {
      hidden.push(s);
      continue;
    }

    if (!s.node.entity) {
      continue;
    }

    const entity = s.node.entity;

    const type = base_entity_type(entity);
    if (['segment', 'arc', 'polycurve'].includes(type)) {
      const end = entity.vertices[entity.vertices.length - 1];
      const start = entity.vertices[0];

      const end_item = {
        minX: end.x, minY: end.y, maxX: end.x, maxY: end.y, type: 'end', entity, entity_type: type,
      };
      const start_item = {
        minX: start.x, minY: start.y, maxX: start.x, maxY: start.y, type: 'start', entity, entity_type: type,
      };

      // link items together to aid deletion
      end_item.pair = start_item;
      start_item.pair = end_item;

      tree.insert(end_item);
      tree.insert(start_item);
    } else {
      result.push(entity);
    }
  }

  // grow entities into polycurves
  while (tree.data.children.length > 0) {
    const current = find_leaf_node(tree.data);
    tree.remove(current);
    tree.remove(current.pair);

    let c = current.entity;

    // Attempt to grow from endpoint
    let growing_end = true;
    while (growing_end) {
      const end = c.vertices[c.vertices.length - 1];

      const end_near = tree.search({
        minX: end.x - fuzz,
        minY: end.y - fuzz,
        maxX: end.x + fuzz,
        maxY: end.y + fuzz,
      });

      if (end_near.length > 0) {
        if (end_near[0].type === 'start') {
          c = join_entities(c, end_near[0].entity, 'a_b');
        } else {
          c = join_entities(c, end_near[0].entity, 'a_brev');
        }
        tree.remove(end_near[0]);
        tree.remove(end_near[0].pair);
        continue; // eslint-disable-line
      }

      growing_end = false;
    }

    // Attempt to grow from startpoint
    let growing_start = true;
    while (growing_start) {
      const start = c.vertices[0];

      const start_near = tree.search({
        minX: start.x - fuzz,
        minY: start.y - fuzz,
        maxX: start.x + fuzz,
        maxY: start.y + fuzz,
      });

      if (start_near.length > 0) {
        if (start_near[0].type === 'end') {
          c = join_entities(c, start_near[0].entity, 'b_a');
        } else {
          c = join_entities(c, start_near[0].entity, 'brev_a');
        }
        tree.remove(start_near[0]);
        tree.remove(start_near[0].pair);
        continue; // eslint-disable-line
      }

      growing_start = false;
    }

    // Check whether curve should be closed
    if (points_are_near(c.vertices[0], c.vertices[c.vertices.length - 1])) {
      c = new Polyface(...c.toShapes());
    }

    result.push(c);
  }

  return sketch.new.add(...hidden, ...result);
};
