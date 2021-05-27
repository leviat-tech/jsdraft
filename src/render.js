const Sketch = require('./sketch/sketch');
const svg = require('./renderers/sketch/svg.js');
const yaml = require('./renderers/sketch/yaml.js');
const json = require('./renderers/sketch/json.js');
const entities = require('./renderers/sketch/entities.js');
const svg_entity = require('./renderers/entity/svg.js');


const sketch_renderers = {
  svg,
  yaml,
  json,
  entities,
};

const entity_renderers = {
  svg: svg_entity,
};

function render(element, format = 'svg', options = {}) {

  // "element" can either be a sketch or an entity
  const renderer = element instanceof Sketch
    ? sketch_renderers[format]
    : entity_renderers[format];

  return renderer(element, options);
}

module.exports = render;
