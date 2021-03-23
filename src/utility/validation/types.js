const entity = ['arc', 'circle', 'point', 'polycurve', 'polyface', 'rectangle', 'segment'];
const standard = ['boolean', 'number', 'string', 'array', 'object'];

module.exports = {
  all: [...entity, ...standard],
  entity,
  standard,
};
