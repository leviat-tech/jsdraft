export default function group(c, ...args) {
  c.definition.groups.push(...args.map(g => g.definition));
  return c;
}
