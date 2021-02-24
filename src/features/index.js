const fill = require('./coloration/fill.js');
const stroke = require('./coloration/stroke.js');

const arc = require('./geometric/arc.js');
const circle = require('./geometric/circle.js');
const face = require('./geometric/face.js');
const point = require('./geometric/point.js');
const polycurve = require('./geometric/polycurve.js');
const segment = require('./geometric/segment.js');

const hide = require('./meta/hide.js');
const name = require('./meta/name.js');
const tag = require('./meta/tag.js');

const subtract = require('./operations/subtract.js');

const rotate = require('./transformations/rotate.js');
const scale = require('./transformations/scale.js');
const transform = require('./transformations/transform.js');
const translate = require('./transformations/translate.js');

const add = require('./add.js');
const draw = require('./draw.js');
const group = require('./group.js');


module.exports = [
  fill,
  stroke,
  arc,
  circle,
  face,
  point,
  polycurve,
  segment,
  hide,
  name,
  tag,
  subtract,
  rotate,
  scale,
  transform,
  translate,
  add,
  draw,
  group,
];
