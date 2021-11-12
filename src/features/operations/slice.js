const flatten = require('@flatten-js/core');
const { base_entity_type } = require('../../utility/misc/entity-type.js');
const Segment = require('../../entities/geometric/segment.js');


module.exports = {
  name: 'slice',
  parameters: [
    { name: 'segment', cast: 'segment' },
    { name: 'remove_original', type: 'boolean', default: true },
  ],
  func: function slice(sketch, segment, remove) {
    for (const s of sketch.tree('level')) {
      const entity = s.node.entity;
      if (!entity) continue;
      const type = base_entity_type(entity);
      if (type !== 'polyface') continue;

      const line = new flatten.Line(segment.ps, segment.pe);
      const intersections = entity.intersect(line)
        .sort((a, b) => new flatten.Vector(segment.ps, a).length - new flatten.Vector(segment.ps, b).length);

      const segments = [];
      const pts = [];
      intersections.forEach((p) => {
        pts.push(p);
        if (pts.length >= 2) {
          segments.push(new Segment(...pts));
          pts.length = 0;
        }
      });

      if (remove) {
        s.node.entity = null;
      }
      if (segments.length > 0) {
        const child = sketch.new.add(...segments);
        s.node.children.push(child);
      }
    }

    return sketch;
  },
};
