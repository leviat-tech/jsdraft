function recurse(c, depth) {
  const padding = ' '.repeat(depth * 4)

  // print node (without geometry)
  const { geometry, children, ...node } = c.node;
  console.log(`${padding}=== META ===`)
  for (key in node) {
    console.log(`${padding}${key}:`, node[key]);
  }

  // print shapes
  if (geometry.length) {
    console.log(`${padding}=== GEOMETRY ===`)
  }
  for (const shape of geometry) {
    console.log(`${padding}`, shape);
  }

  // print children
  if (children.length) {
    console.log(`${padding}=== CHILDREN ===`)
  }
  for (const n of children) {
    recurse(n, depth + 1)
  }
}

module.exports = function render(composition) {
  recurse(composition, 0);
}
