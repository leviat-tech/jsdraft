const fill = require('./style/fill.js');
const hatch = require('./style/hatch.js');
const linestyle = require('./style/linestyle.js');
const stroke = require('./style/stroke.js');
const style = require('./style/style.js');
const style_all = require('./style/style_all.js');

const aligned_dim = require('./annotation/aligned-dim.js');
const angle_dim = require('./annotation/angle-dim.js');
const diameter_dim = require('./annotation/diameter-dim.js');
const dim_string = require('./annotation/dim-string.js');
const leader = require('./annotation/leader.js');
const radius_dim = require('./annotation/radius-dim.js');
const text = require('./annotation/text.js');

const arc = require('./geometric/arc.js');
const bbox = require('./geometric/bbox.js');
const circle = require('./geometric/circle.js');
const point = require('./geometric/point.js');
const polycurve = require('./geometric/polycurve.js');
const polyface = require('./geometric/polyface.js');
const rectangle = require('./geometric/rectangle.js');
const segment = require('./geometric/segment.js');

const add_attribute = require('./meta/add-attribute.js');
const hide = require('./meta/hide.js');
const ignore_mask = require('./meta/ignore-mask.js');
const layer = require('./meta/layer.js');
const mask = require('./meta/mask.js');
const name = require('./meta/name.js');
const show = require('./meta/show.js');
const tag = require('./meta/tag.js');
const z = require('./meta/z.js');

const add_faces = require('./operations/add-faces.js');
const b_and = require('./operations/and.js');
const close = require('./operations/close.js');
const explode = require('./operations/explode.js');
const fillet = require('./operations/fillet.js');
const interpolate = require('./operations/interpolate.js');
const intersect = require('./operations/intersect.js');
const join = require('./operations/join.js');
const offset = require('./operations/offset.js');
const prune = require('./operations/prune.js');
const slice = require('./operations/slice.js');
const subtract = require('./operations/subtract.js');
const union = require('./operations/union.js');

const orient = require('./transformations/orient.js');
const snap = require('./transformations/snap.js');
const rotate = require('./transformations/rotate.js');
const scale = require('./transformations/scale.js');
const transform = require('./transformations/transform.js');
const translate = require('./transformations/translate.js');

const rainbow = require('./debugging/rainbow.js');


module.exports = {
  fill,
  hatch,
  linestyle,
  stroke,
  style,
  style_all,

  aligned_dim,
  angle_dim,
  diameter_dim,
  dim_string,
  leader,
  radius_dim,
  text,

  arc,
  bbox,
  circle,
  point,
  polycurve,
  polyface,
  rectangle,
  segment,

  add_attribute,
  hide,
  ignore_mask,
  layer,
  mask,
  name,
  show,
  tag,
  z,

  add_faces,
  and: b_and,
  close,
  explode,
  fillet,
  interpolate,
  intersect,
  join,
  offset,
  prune,
  slice,
  subtract,
  union,

  orient,
  snap,
  rotate,
  scale,
  transform,
  translate,

  rainbow,
};
