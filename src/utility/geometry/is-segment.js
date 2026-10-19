// Reads `isSegment` from a flatten-js edge in a version-agnostic way.
// flatten-js exposes `isSegment` as a method in older versions (<= ~1.4.x) and as a
// getter / boolean property in newer versions (>= ~1.5). Normalize both to a boolean.
function is_segment(edge) {
  return typeof edge.isSegment === 'function' ? edge.isSegment() : edge.isSegment;
}

module.exports = is_segment;
