module.exports = function explode(sketch) {
  return sketch.new.add(...sketch.edges);
};
