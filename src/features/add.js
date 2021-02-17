module.exports = function add(sketch, ...sketches) {
  sketches.forEach(s => sketch.node.children.push(s))
  return sketch
}
