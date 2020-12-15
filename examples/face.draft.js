export default function face(c, color, happy=true) {
  const eyes = c.group(
    c.line(20, 20, 20, 40),
    c.line(30, 20, 30, 40),
  );

  const smile = c.group(
    c.line(10, 20, 20, 10),
    c.line(20, 10, 30, 10),
    c.line(30, 10, 40, 20),
  );

  const frown = c.group(
    c.line(10, 0, 20, 10),
    c.line(20, 10, 30, 10),
    c.line(30, 10, 40, 0),
  );

  const mouth = happy ? smile : frown;

  return c.group(eyes, mouth).stroke(1, color);
}
