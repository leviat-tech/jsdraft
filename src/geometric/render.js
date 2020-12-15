function recurse(definition, depth) {
  const padding = ' '.repeat(depth * 2)
  console.log(`${padding}stroke:`, definition.stroke);
  console.log(`${padding}lines:`, definition.lines);
  console.log(`${padding}-------`)
  for (const g of definition.groups) {
    recurse(g, depth + 1)
  }
}

export default function render(c) {
  recurse(c.definition, 0);
  return c;
}
