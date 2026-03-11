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

const unit_scale = {
  m: 1,
  cm: 100,
  mm: 1000,
  in: 39.3701,
  ft: 3.28084,
  yd: 1.09361,
};

const renderers = {
  point: function point(d, entity, { scale = 1 } = {}) {
    d.drawPoint(entity.x * scale, entity.y * scale);
  },

  segment: function segment(d, entity, { scale = 1 } = {}) {
    d.drawLine(entity.ps.x * scale, entity.ps.y * scale, entity.pe.x * scale, entity.pe.y * scale);
  },

  arc: function arc(d, entity, { scale = 1 } = {}) {
    d.drawArc(
      entity.pc.x * scale,
      entity.pc.y * scale,
      entity.r * scale,
      rad_to_deg(entity.startAngle),
      rad_to_deg(entity.endAngle),
    );
  },

  polycurve: function polycurve(d, entity, { scale = 1 } = {}) {
    const vertices = polycurve_to_vertices(entity, 'polycurve')
      .map((v) => ([v.x * scale, v.y * scale, v.bulge]));
    d.drawPolyline(vertices);
  },

  polyface: function polyface(d, entity, { scale = 1 } = {}) {
    const polylines = [];
    for (const face of entity.faces) {
      const pf = new Polyface();
      pf.addFace(face);
      polylines.push(polycurve_to_vertices(pf, 'polyface').map((v) => ([v.x * scale, v.y * scale, v.bulge])));
    }

    polylines.forEach((polyline) => {
      d.drawPolyline(polyline, true);
    });
  },

  text: function text(d, entity, {
    scale = 1,
    annotation_scale = 1,
    style: {
      annotation: {
        scale: anno_scale = 1,
        font_size = 12,
        h_align = 'center',
        v_align = 'middle',
      } = {},
    } = {},
  } = {}) {
    const s = annotation_scale * anno_scale;
    const fs = font_size * s;
    d.drawText(entity.p.x * scale, entity.p.y * scale, fs, entity.rotation, entity.text, h_align, v_align);
  },
};

function dxf(entity, { model_unit = 'mm' } = {}) {
  const d = new DxfWriter();
  d.setUnits(units[model_unit]);
  const scale = unit_scale[model_unit] || 1;
  const type = base_entity_type(entity);
  const renderer = renderers[type];
  renderer(d, entity, { scale });
  return d.toDxfString();
}

module.exports = {
  renderers,
  dxf,
};
