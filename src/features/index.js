const fill = require('./style/fill.js');
const stroke = require('./style/stroke.js');

const arc = require('./geometric/arc.js');
const circle = require('./geometric/circle.js');
const point = require('./geometric/point.js');
const polycurve = require('./geometric/polycurve.js');
const rectangle = require('./geometric/rectangle.js');
const segment = require('./geometric/segment.js');
const polyface = require('./geometric/polyface.js');

const hide = require('./meta/hide.js');
const name = require('./meta/name.js');
const tag = require('./meta/tag.js');

const add_face = require('./operations/add-face.js');
const explode = require('./operations/explode.js');
const fillet = require('./operations/fillet.js');
const interpolate = require('./operations/interpolate.js');
const join = require('./operations/join.js');
const subtract = require('./operations/subtract.js');

const rotate = require('./transformations/rotate.js');
const scale = require('./transformations/scale.js');
const transform = require('./transformations/transform.js');
const translate = require('./transformations/translate.js');


module.exports = [
  fill,
  stroke,
  arc,
  circle,
  point,
  polycurve,
  polyface,
  rectangle,
  segment,
  hide,
  name,
  tag,
  add_face,
  explode,
  fillet,
  interpolate,
  join,
  subtract,
  rotate,
  scale,
  transform,
  translate,
];
