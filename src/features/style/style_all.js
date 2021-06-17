const merge = require('lodash/merge');
const cloneDeep = require('lodash/cloneDeep');


function recurse(sketch, style) {
  sketch.node.children.forEach((child) => {
    if (child.node.style) {
      const s = merge({}, child.node.style, cloneDeep(style));
      child.node.style = s;
    }
    recurse(child, style);
  });
}

module.exports = function style_all(sketch, style_arg) {
  const s = typeof style_arg === 'string'
    ? sketch.node.styles[style_arg]
    : style_arg;

  const style = merge({}, sketch.node.style, s);
  sketch.node.style = style;

  recurse(sketch, s);

  return sketch;
};
