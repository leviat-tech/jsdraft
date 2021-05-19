const merge = require('lodash/merge');


module.exports = function style(sketch, style_name) {
  const s = sketch.node.styles[style_name];
  sketch.node.style = merge({}, sketch.node.style, s);
  return sketch;
};
