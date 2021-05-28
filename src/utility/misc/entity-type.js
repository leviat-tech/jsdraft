const flatten = require('@flatten-js/core');
const snakeCase = require('lodash/snakeCase');


function base_entity_type(entity) {
  if (entity instanceof flatten.Point) return 'point';
  if (entity instanceof flatten.Segment) return 'segment';
  if (entity instanceof flatten.Arc) return 'arc';
  if (entity instanceof flatten.Multiline) return 'polycurve';
  if (entity instanceof flatten.Polygon) return 'polyface';
  return snakeCase(entity.type);
}

function entity_type(entity) {
  return entity.type;
  const constructor_name = entity.constructor.name;

  return {
    Multiline: 'polycurve',
    Polygon: 'polyface',
  }[constructor_name] || snakeCase(entity.constructor.name);
}

module.exports = { base_entity_type, entity_type };
