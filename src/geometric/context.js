const { implement } = require('../context.js');
const stroke = require('./stroke.js');
const line = require('./line.js');
const group = require('./group.js');
const render = require('./render.js');

const Context = implement(
  line,
  stroke,
  group,
  render
);

module.exports = Context;
