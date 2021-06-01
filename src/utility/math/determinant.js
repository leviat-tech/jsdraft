function determinant(m) {
  if (m.length === 1) return m[0][0];
  if (m.length === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];

  return m[0]
    .reduce(
      (r, e, i) => r + (-1) ** (i + 2) * e * determinant(
        m.slice(1).map((c) => c.filter((_, j) => i !== j)),
      ),
      0,
    );
}

module.exports = determinant;
