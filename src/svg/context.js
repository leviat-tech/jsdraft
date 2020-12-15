const Context = require('../geometric/context.js');
const render = require('./render.js');

Context.include(render);

module.exports = Context;
