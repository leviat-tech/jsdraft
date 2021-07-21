const DxfWriter = require('dxf-writer');
const polycurve_to_vertices = require('../../utility/geometry/polycurve-to-vertices.js');
const Polyface = require('../../entities/geometric/polyface.js');
const { rad_to_deg } = require('../../utility/misc/rad-deg.js');
const { base_entity_type } = require('../../utility/misc/entity-type.js');


const units = {
  m: 'Meters',
  cm: 'Centimeters',
  mm: 'Millimeters',
  in: 'Inches',
  ft: 'Feet',
  yd: 'Yards',
};

const renderers = {
  point: function point(d, entity) {
    d.drawPoint(entity.x, entity.y);
  },

  segment: function segment(d, entity) {
    d.drawLine(entity.ps.x, entity.ps.y, entity.pe.x, entity.pe.y);
  },

  arc: function arc(d, entity) {
    d.drawArc(
      entity.pc.x,
      entity.pc.y,
      entity.r,
      rad_to_deg(entity.startAngle),
      rad_to_deg(entity.endAngle),
    );
  },

  polycurve: function polycurve(d, entity) {
    const vertices = polycurve_to_vertices(entity, 'polycurve')
      .map((v) => ([v.x, v.y, v.bulge]));
    d.drawPolyline(vertices);
  },

  polyface: function polyface(d, entity) {
    const polylines = [];
    for (const face of entity.faces) {
      const pf = new Polyface();
      pf.addFace(face);
      polylines.push(polycurve_to_vertices(pf, 'polyface').map((v) => ([v.x, v.y, v.bulge])));
    }

    polylines.forEach((polyline) => {
      d.drawPolyline(polyline, true);
    });
  },

  text: function text(d, entity, {
    annotation_scale = 1,
    style: {
      annotation: {
        scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
      } = {},
    } = {},
  } = {}) {
    const s = annotation_scale * scale;
    const fs = font_size * s;
    d.drawText(entity.p.x, entity.p.y, fs, entity.rotation, entity.text, h_align, v_align);
  },
};

function dxf(entity, { model_unit } = {}) {
  const d = new DxfWriter();
  d.header('ACADVER', [[1, 'AC1009']]);
  d.setUnits(units[model_unit]);
  const type = base_entity_type(entity);
  const renderer = renderers[type];
  renderer(d, entity);
  return d.toDxfString();
}

module.exports = {
  renderers,
  dxf,
};
