export default function line(c, x1, y1, x2, y2) {
  c.definition.lines.push([[x1, y1], [x2, y2]]);
  return c;
}
