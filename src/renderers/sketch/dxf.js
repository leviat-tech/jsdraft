const DxfWriter = require('dxf-writer');
const merge = require('lodash/merge');
const get = require('lodash/get');
const cloneDeep = require('lodash/cloneDeep');
const { base_entity_type } = require('../../utility/misc/entity-type');
const { renderers } = require('../entity/dxf.js');


const units = {
  m: 'Meters',
  cm: 'Centimeters',
  mm: 'Millimeters',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
};

function recurse(sketch, d, options) {
  options = cloneDeep(options);

  options.style = merge({}, options.style, sketch.node.style);
  options.layer = sketch.node.layer || options.layer;

  if (sketch.node.hidden && options.show === 'visible') return;

  if (options.layer) {
    if (!d.layers[options.layer]) {
      const color = get(options, 'style.stroke.color') || 'white';
      // TODO: support dashed linetypes
      const linetype = 'continuous';

      d.addLayer(
        options.layer,
        DxfWriter.ACI[color.toUpperCase()] || DxfWriter.ACI.WHITE,
        linetype.toUpperCase(),
      );
    }

    if (options.layer !== d.activeLayer.name) d.setActiveLayer(options.layer);
  }

  if (sketch.node.entity) {
    const type = base_entity_type(sketch.node.entity);
    if (renderers[type]) renderers[type](d, sketch.node.entity, options);
  }

  for (const child of sketch.node.children) {
    recurse(child, d, options);
  }
}

function render(sketch, {
  layers = {},
  show = 'visible',
  model_unit = 'mm',
} = {}) {
  const d = new DxfWriter();
  d.setUnits(units[model_unit]);

  Object.entries(layers).forEach(([name, layer]) => {
    const color = layer.color || 'white';
    const linetype = layer.linetype || 'continuous';
    const trueColor = layer.trueColor || -1;

    d.addLayer(
      name,
      DxfWriter.ACI[color.toUpperCase()],
      linetype.toUpperCase(),
    );
    if (trueColor !== -1) {
      d.setActiveLayer(name);
      d.setTrueColor(layer.trueColor);
    }
  });

  const layer = '0';
  recurse(sketch, d, { show, layer });

  return d.toDxfString();
}

module.exports = render;
