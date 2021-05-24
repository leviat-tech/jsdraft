const flatten = require('@flatten-js/core');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const assert = require('../../utility/validation/assert.js');
const polyface_orientation = require('../../utility/geometry/polyface-orientation.js');
const intersect_polycurve = require('../../utility/geometry/intersect-polycurve.js');
const split_polycurve = require('../../utility/geometry/split-polycurve.js');
const split_segment = require('../../utility/geometry/split-segment.js');
const points_are_near = require('../../utility/geometry/points-are-near.js');
const Polycurve = require('../../entities/geometric/polycurve.js');


module.exports = function subtract(sketch, to_subtract) {
  const entities = sketch.entities;
  to_subtract = assert(to_subtract, 'sketch', sketch);
  const subtracted_polyfaces = to_subtract.polyfaces;

  const result = entities.reduce((res, entity) => {
    const type = base_entity_type(entity);
    if (type === 'polyface') {
      if (polyface_orientation(entity) !== -1) entity.reverse();

      const subtracted = subtracted_polyfaces.reduce((r, polyface) => {
        if (polyface_orientation(polyface) !== -1) polyface.reverse();
        return flatten.BooleanOperations.subtract(r, polyface);
      }, entity);

      res.push(subtracted);
    }

    if (['arc', 'segment'].includes(type)) {
      const intersections = subtracted_polyfaces.reduce((i, polyface) => {
        i.push(...polyface.intersect(entity));
        return i;
      }, []);

      const split = split_segment(entity, intersections);

      split.forEach((segment) => {
        const is_contained = subtracted_polyfaces
          .some((polyface) => polyface.contains(segment));

        if (!is_contained) res.push(segment);
      });
    }

    if (type === 'point') {
      const is_contained = subtracted_polyfaces
        .some((polyface) => polyface.contains(entity));

      if (!is_contained) res.push(entity);
    }

    if (type === 'polycurve') {
      const intersections = subtracted_polyfaces.reduce((i, polyface) => {
        i.push(...intersect_polycurve(entity, polyface));
        return i;
      }, []);

      const split = split_polycurve(entity, intersections);

      const pcurves = split
        // Remove contained segments from flat list of segments
        .reduce((segs, segment) => {
          const is_contained = subtracted_polyfaces
            .some((polyface) => polyface.contains(segment));
          if (!is_contained) segs.push(segment);
          return segs;
        }, [])

        // Turn flat segment list to array of chains
        .reduce((p, seg) => {
          const chain = p[p.length - 1];

          if (!chain) {
            p.push([seg]);
            return p;
          }

          const last = chain[chain.length - 1];
          const end = last.vertices[1];
          const start = seg.vertices[0];
          if (points_are_near(start, end)) {
            chain.push(seg);
          } else {
            p.push([seg]);
          }

          return p;
        }, [])

        // Join chains into polycurves
        .map((chain) => new Polycurve(...chain));

      res.push(...pcurves);
    }

    return res;
  }, []);

  return sketch.new.add(...result);
};
