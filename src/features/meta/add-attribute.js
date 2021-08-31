module.exports = function add_attribute(sketch, name, attribute) {
  sketch.node.attributes[name] = attribute;
  return sketch;
};
