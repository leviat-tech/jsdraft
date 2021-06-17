const merge = require('lodash/merge');


module.exports = function style(sketch, style_arg) {
  const s = typeof style_arg === 'string'
    ? sketch.node.styles[style_arg]
    : style_arg;

  sketch.node.style = merge({}, sketch.node.style, s);
  return sketch;
};
