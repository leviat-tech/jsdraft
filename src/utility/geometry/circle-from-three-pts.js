const { det } = require('mathjs');


function circle_from_three_pts(start, through, end) {
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = through;
  const { x: x3, y: y3 } = end;

  const A = det([
    [x1, y1, 1],
    [x2, y2, 1],
    [x3, y3, 1],
  ]);

  const sq1 = x1 ** 2 + y1 ** 2;
  const sq2 = x2 ** 2 + y2 ** 2;
  const sq3 = x3 ** 2 + y3 ** 2;

  const B = -det([
    [sq1, y1, 1],
    [sq2, y2, 1],
    [sq3, y3, 1],
  ]);

  const C = det([
    [sq1, x1, 1],
    [sq2, x2, 1],
    [sq3, x3, 1],
  ]);

  const D = -det([
    [sq1, x1, y1],
    [sq2, x2, y2],
    [sq3, x3, y3],
  ]);

  const x = -B / (2 * A);
  const y = -C / (2 * A);
  const r = Math.sqrt((B ** 2 + C ** 2 - 4 * A * D) / (4 * A ** 2));

  return { x, y, r };
}

export default circle_from_three_pts;
