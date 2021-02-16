function recurse(c, depth) {
  const padding = ' '.repeat(depth * 4)

  // print node (without entities)
  const { entities, children, ...node } = c.node;
  console.log(`${padding}=== META ===`)
  for (key in node) {
    console.log(`${padding}${key}:`, node[key]);
  }

  // print entities
  if (entities.length) {
    console.log(`${padding}=== ENTITIES ===`)
  }
  for (const entity of entities) {
    console.log(`${padding}`, entity);
  }

  // print children
  if (children.length) {
    console.log(`${padding}=== CHILDREN ===`)
  }
  for (const n of children) {
    recurse(n, depth + 1)
  }
}

module.exports = function render(sketch) {
  recurse(sketch, 0);
}
