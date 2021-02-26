const abs = Math.abs;
const min = Math.min;

function almost_equal(
  a,
  b,
  absoluteError = 2.2204460492503131e-16,
  relativeError = 1.19209290e-7,
) {
  const d = abs(a - b);

  if (absoluteError == null) absoluteError = almostEqual.DBL_EPSILON;
  if (relativeError == null) relativeError = absoluteError;

  if (d <= absoluteError) {
    return true;
  }
  if (d <= relativeError * min(abs(a), abs(b))) {
    return true;
  }

  return a === b;
}

module.exports = almost_equal;
