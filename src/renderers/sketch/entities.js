const flatten = require('@flatten-js/core');
const cloneDeep = require('lodash/cloneDeep');
const merge = require('lodash/merge');
const { base_entity_type } = require('../../utility/misc/entity-type.js');


const props = {
  point(pt) {
    return { x: pt.x, y: pt.y };
  },

  segment(seg) {
    const ps = this.point(seg.ps);
    const pe = this.point(seg.pe);
    return { ps, pe };
  },

  arc(arc) {
    const pc = this.point(arc.pc);
    return { ...arc, pc };
  },

  polycurve(pcurve) {
    const edges = pcurve.edges.map((edge) => {
      const shape = edge.shape;
      if (shape instanceof flatten.Arc) return { ...this.arc(shape), type: 'arc' };
      return { ...this.segment(shape), type: 'segment' };
    });
    return { edges };
  },

  polyface(pface) {
    const faces = [...pface.faces].map((face) => {
      const edges = face.edges.map((edge) => {
        const shape = edge.shape;
        if (shape instanceof flatten.Arc) return { ...this.arc(shape), type: 'arc' };
        return { ...this.segment(shape), type: 'segment' };
      });

      return {
        edges,
      };
    });

    return { faces };
  },

  rectangle(rect) {
    return this.polyface(rect);
  },

  circ(rect) {
    return this.polyface(rect);
  },
};


function recurse(sketch, options) {
  options = cloneDeep(options);
  const entity_list = [];

  if (sketch.node.hidden && options.show === 'visible') return entity_list;
  if (!sketch.node.hidden && options.show === 'hidden') return entity_list;

  options.style = merge({}, options.style, sketch.node.style);
  options.z = sketch.node.z || options.z;

  if (sketch.node.entity) {
    const type = sketch.node.entity.type;
    const properties = props[type]
      ? props[type](sketch.node.entity)
      : sketch.node.entity.toJSON();

    entity_list.push({
      entity_type: type,
      base_entity_type: base_entity_type(sketch.node.entity),
      properties,
      style: options.style,
      z: options.z || 0,
    });
  }

  for (const child of sketch.node.children) {
    entity_list.push(...recurse(child, options));
  }

  return entity_list;
}

function render(sketch, {
  show = 'visible',
  serialize = false,
} = {}) {
  if (!serialize) return [...sketch.shapes('depth', show)];

  const entity_list = recurse(sketch, { show });
  entity_list.sort((a, b) => a.z - b.z);
  return entity_list;
}

module.exports = render;
