/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const polycurve_to_vertices = require('../../../src/utility/geometry/polycurve-to-vertices.js');


// `polycurve_to_vertices` already guards `isSegment` access, so it works under both the
// method form (older @flatten-js/core, e.g. the installed 1.4.4) and the getter form
// (>= ~1.5, e.g. 1.6.14). These stubs keep the test independent of the installed patch
// version by expressing the same edge chain under each form.

// Edge stub exposing `isSegment` as a method (function) - method form.
function method_edge(is_segment, shape) {
  return { shape, isSegment() { return is_segment; } };
}

// Edge stub exposing `isSegment` as a getter (boolean property) - getter form.
function getter_edge(is_segment, shape) {
  const edge = { shape };
  Object.defineProperty(edge, 'isSegment', {
    get() { return is_segment; },
    enumerable: true,
    configurable: true,
  });
  return edge;
}

// A simple arc-shape stub matching the surface `polycurve_to_vertices` reads from an arc
// edge: `sweep`, `startAngle`, `endAngle`, `counterClockwise`, and `middle()`.
function arc_shape(sweep, startAngle, endAngle, ccw, mid) {
  return {
    sweep,
    startAngle,
    endAngle,
    counterClockwise: ccw,
    middle() { return { x: mid[0], y: mid[1] }; },
  };
}

// Build a polycurve/polyface-like entity whose edges are produced by `make_edge`.
function square_entity(make_edge) {
  return {
    vertices: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ],
    edges: [
      make_edge(true, {}),
      make_edge(true, {}),
      make_edge(true, {}),
      make_edge(true, {}),
    ],
  };
}

// Entity with one arc edge (sweep < PI) to exercise the bulge branch.
function arc_entity(make_edge) {
  return {
    vertices: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ],
    edges: [
      make_edge(true, {}),
      make_edge(false, arc_shape(Math.PI / 2, 0, Math.PI / 2, true, [12, 5])),
      make_edge(true, {}),
    ],
  };
}


describe('polycurve_to_vertices (method/getter-form preservation)', () => {

  // Requirement 3.5: all-segment polycurve yields the same vertices under both forms.
  it('yields identical vertices for an all-segment polycurve under both forms', () => {
    const method = polycurve_to_vertices(square_entity(method_edge), 'polycurve');
    const getter = polycurve_to_vertices(square_entity(getter_edge), 'polycurve');

    expect(getter).to.deep.equal(method);
    // Baseline observed on unfixed code: each vertex has bulge 0 and the loop closes.
    expect(method).to.deep.equal([
      { x: 0, y: 0, bulge: 0 },
      { x: 10, y: 0, bulge: 0 },
      { x: 10, y: 10, bulge: 0 },
      { x: 0, y: 10, bulge: 0 },
      { x: 0, y: 0, bulge: 0 },
    ]);
  });

  // Requirement 3.5: all-segment polyface yields the same vertices under both forms.
  it('yields identical vertices for an all-segment polyface under both forms', () => {
    const method = polycurve_to_vertices(square_entity(method_edge), 'polyface');
    const getter = polycurve_to_vertices(square_entity(getter_edge), 'polyface');

    expect(getter).to.deep.equal(method);
    // Baseline observed on unfixed code: polyface omits the closing vertex.
    expect(method).to.deep.equal([
      { x: 0, y: 0, bulge: 0 },
      { x: 10, y: 0, bulge: 0 },
      { x: 10, y: 10, bulge: 0 },
      { x: 0, y: 10, bulge: 0 },
    ]);
  });

  // Requirement 3.5: an entity with an arc edge yields identical bulges under both forms.
  it('yields identical vertices (with bulge) for an arc edge under both forms', () => {
    const method = polycurve_to_vertices(arc_entity(method_edge), 'polycurve');
    const getter = polycurve_to_vertices(arc_entity(getter_edge), 'polycurve');

    expect(getter).to.deep.equal(method);
    // Baseline observed on unfixed code: the arc sets a non-zero bulge on the vertex
    // preceding it (the arc branch is exercised identically under both forms).
    expect(method).to.deep.equal([
      { x: 0, y: 0, bulge: 0 },
      { x: 10, y: 0, bulge: 0.41421356237309503 },
      { x: 10, y: 10, bulge: 0 },
      { x: 0, y: 0, bulge: 0 },
    ]);
  });

});
