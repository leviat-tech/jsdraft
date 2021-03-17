const flatten = require('@flatten-js/core');


function base_entity_type(entity) {
  if (entity instanceof flatten.Point) return 'point';
  if (entity instanceof flatten.Segment) return 'segment';
  if (entity instanceof flatten.Arc) return 'arc';
  if (entity instanceof flatten.Multiline) return 'polycurve';
  if (entity instanceof flatten.Polygon) return 'polyface';
  return null;
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
  ].includes(constructor_name)) return constructor_name.toLowerCase();

  return base_entity_type(entity);
}

module.exports = { base_entity_type, entity_type };
