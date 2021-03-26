const flatten = require('@flatten-js/core');
const snakeCase = require('lodash/snakeCase');


function base_entity_type(entity) {
  if (entity instanceof flatten.Point) return 'point';
  if (entity instanceof flatten.Segment) return 'segment';
  if (entity instanceof flatten.Arc) return 'arc';
  if (entity instanceof flatten.Multiline) return 'polycurve';
  if (entity instanceof flatten.Polygon) return 'polyface';
  return snakeCase(entity.constructor.name);
}

function entity_type(entity) {
  const constructor_name = entity.constructor.name;

  if ([
    'Arc',
    'Circle',
    'Point',
    'Polycurve',
    'Polyface',
    'Rectangle',
    'Segment',
    'AlignedDim',
    'Text',
  ].includes(constructor_name)) return snakeCase(constructor_name);

  return base_entity_type(entity);
}

module.exports = { base_entity_type, entity_type };
