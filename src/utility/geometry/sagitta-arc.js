const Vector = require('@crhio/vector').default;


const determinant = (m) => (m.length == 1 // eslint-disable-line
  ? m[0][0]
  : m.length === 2
    ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
    : m[0].reduce((r, e, i) => r + (-1) ** (i + 2) * e * determinant(m.slice(1).map((c) => c.filter((_, j) => i != j))), 0)); // eslint-disable-line

const slice_matrix = (m, s) => m.map((row) => s.map((i) => row[i]));

function sagitta_arc(pta, ptb, bulge) {
  let n = [ptb.y - pta.y, pta.x - ptb.x];
  const sum = n.map((v) => v ** 2).reduce((a, v) => a + v, 0);
  const n_dist = Math.sqrt(sum);
  if (n_dist === 0) {
    return { radius: null, center: null };
  }
  const sagitta = bulge * (n_dist / 2);

  n = n.map((v) => (v * sagitta) / n_dist);
  const ptc = Vector(pta).add(ptb).scale(0.5).add(Vector({ x: n[0], y: n[1] }));
  const matrix = [
    [pta.x ** 2 + pta.y ** 2, pta.x, pta.y, 1],
    [ptb.x ** 2 + ptb.y ** 2, ptb.x, ptb.y, 1],
    [ptc.x ** 2 + ptc.y ** 2, ptc.x, ptc.y, 1],
  ];
  const m11 = determinant(slice_matrix(matrix, [1, 2, 3]));
  const m12 = determinant(slice_matrix(matrix, [0, 2, 3]));
  const m13 = determinant(slice_matrix(matrix, [0, 1, 3]));
  const m14 = determinant(slice_matrix(matrix, [0, 1, 2]));
  if (m11 === 0) {
    return { radius: null, center: null };
  }

  const cx = 0.5 * (m12 / m11);
  const cy = -0.5 * (m13 / m11);
  const radius = Math.sqrt(cx ** 2 + cy ** 2 + m14 / m11);

  const start_angle = Vector(pta).subtract({ x: cx, y: cy }).angle();
  const end_angle = Vector(ptb).subtract({ x: cx, y: cy }).angle();
  const ccw = bulge < 0;

  return { radius, center: { x: cx, y: cy }, start_angle, end_angle, ccw };
}

module.exports = sagitta_arc;
