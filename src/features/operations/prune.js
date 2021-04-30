function shouldRemove(sketch, conditions) {
  return conditions.some((condition) => (typeof condition === 'string'
    ? sketch.node.id === condition || sketch.node.name === condition
    : condition(sketch)));
}

function traverse(sketch, conditions) {
  if (shouldRemove(sketch, conditions)) return null;

  sketch.node.children = sketch.node.children
    .map((child) => traverse(child, conditions))
    .filter((child) => child);

  return sketch;
}

module.exports = function prune(sketch, ...conditions) {
  if (shouldRemove(sketch, conditions)) return sketch.new;
  const traversed = traverse(sketch, conditions);
  return traversed;
};
