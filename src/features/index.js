const fill = require('./style/fill.js');
const stroke = require('./style/stroke.js');

const aligned_dim = require('./annotation/aligned-dim.js');
const text = require('./annotation/text.js');

const arc = require('./geometric/arc.js');
const circle = require('./geometric/circle.js');
const point = require('./geometric/point.js');
const polycurve = require('./geometric/polycurve.js');
const rectangle = require('./geometric/rectangle.js');
const segment = require('./geometric/segment.js');
const polyface = require('./geometric/polyface.js');

const hide = require('./meta/hide.js');
const name = require('./meta/name.js');
const show = require('./meta/show.js');
const tag = require('./meta/tag.js');

const add_faces = require('./operations/add-faces.js');
const explode = require('./operations/explode.js');
const fillet = require('./operations/fillet.js');
const interpolate = require('./operations/interpolate.js');
const join = require('./operations/join.js');
const offset = require('./operations/offset.js');
const subtract = require('./operations/subtract.js');
const union = require('./operations/union.js');

const orient = require('./transformations/orient.js');
const snap = require('./transformations/snap.js');
const rotate = require('./transformations/rotate.js');
const scale = require('./transformations/scale.js');
const transform = require('./transformations/transform.js');
const translate = require('./transformations/translate.js');

const rainbow = require('./debugging/rainbow.js');


module.exports = [
  fill,
  stroke,

  aligned_dim,
  text,

  arc,
  circle,
  point,
  polycurve,
  rectangle,
  segment,
  polyface,

  hide,
  name,
  show,
  tag,

  add_faces,
  explode,
  fillet,
  interpolate,
  join,
  offset,
  subtract,
  union,

  orient,
  snap,
  rotate,
  scale,
  transform,
  translate,

  rainbow,
];
