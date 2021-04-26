const Sketch = require('./sketch/sketch');
const svg = require('./renderers/sketch/svg.js');
const yaml = require('./renderers/sketch/yaml.js');
const json = require('./renderers/sketch/json.js');

const svg_entity = require('./renderers/entity/svg.js');


const sketch_renderers = {
  svg,
  yaml,
  json,
  entities: function e(sketch) { return [...sketch.shapes()]; },
};

const entity_renderers = {
  svg: svg_entity,
};

function render(element, format = 'svg', options = {}) {

  // "element" can either be a sketch or an entity
  const renderer = element instanceof Sketch
    ? sketch_renderers[format]
    : entity_renderers[format];

  const patterns = `
  <defs>
    <pattern id="hatch" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
      <line style="stroke:black;stroke-width:1" x1="5" y1="0" x2="5" y2="10" />
      <line style="stroke:black;stroke-width:1" x1="0" y1="5" x2="10" y2="5" />
    </pattern>
  </defs>
  `;
  const svg = renderer(element, options);
  console.log(patterns, svg);
  return svg;
}

module.exports = render;
