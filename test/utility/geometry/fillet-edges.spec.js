/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const fillet_edges = require('../../../src/utility/geometry/fillet-edges.js');


// Build an edge-like stub that exposes `isSegment` as a getter (boolean property),
// mirroring how @flatten-js/core >= ~1.5 (e.g. 1.6.14) exposes it. This keeps the
// test independent of the installed flatten-js patch version (1.4.4 = method form).
function getter_edge(is_segment, ps, pe) {
  const edge = {
    shape: {
      ps: { x: ps[0], y: ps[1] },
      pe: { x: pe[0], y: pe[1] },
    },
    next: undefined,
  };
  Object.defineProperty(edge, 'isSegment', {
    get() { return is_segment; },
    enumerable: true,
    configurable: true,
  });
  return edge;
}

// Build an edge-like stub that exposes `isSegment` as a method (a function), mirroring
// how @flatten-js/core <= ~1.4.x (e.g. the installed 1.4.4) exposes it. The bug condition
// does NOT hold for these stubs, so they capture the baseline behavior to preserve.
function method_edge(is_segment, ps, pe) {
  return {
    shape: {
      ps: { x: ps[0], y: ps[1] },
      pe: { x: pe[0], y: pe[1] },
    },
    next: undefined,
    isSegment() { return is_segment; },
  };
}

// Build an entity-like iterable over a list of edges, matching the surface that
// `fillet_edges` consumes: a `for..of` iterable plus an `insert(edge, after)` method.
function entity_from(edges) {
  const list = [...edges];
  return {
    inserted: [],
    [Symbol.iterator]() { return list[Symbol.iterator](); },
    insert(edge, after) { this.inserted.push({ edge, after }); },
  };
}


describe('fillet_edges (getter-form isSegment)', () => {

  // Bug Condition / Requirement 1.1, Expected Behavior 2.1
  it('reads a getter-form current edge without throwing', () => {
    const edge = getter_edge(true, [0, 0], [10, 0]);
    const next = getter_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    // Expected Behavior: no throw; segment status read correctly and a fillet
    // arc is inserted between two getter-form segment edges.
    expect(() => fillet_edges(entity, 2, 0)).to.not.throw();
    expect(entity.inserted.length).to.equal(1);
  });

  // Requirement 1.2, Expected Behavior 2.2
  it('reads a getter-form next edge without throwing', () => {
    const edge = getter_edge(true, [0, 0], [10, 0]);
    const next = getter_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    // Expected Behavior: the current edge's getter resolves true, then the
    // `edge.next` getter must also be read without throwing.
    expect(() => fillet_edges(entity, 2, 0)).to.not.throw();
    expect(entity.inserted.length).to.equal(1);
  });

  // Getter-form arc edge, Requirement 2.1
  it('reads a getter-form arc edge (false) without throwing and skips it', () => {
    const edge = getter_edge(false, [0, 0], [10, 0]);
    const next = getter_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    // Expected Behavior: getter returns false, the edge is treated as an arc,
    // and filleting is skipped without throwing.
    expect(() => fillet_edges(entity, 2, 0)).to.not.throw();
    expect(entity.inserted.length).to.equal(0);
  });

});

// Preservation (Property 2): method-form behavior must stay exactly as it is today.
// The bug condition does NOT hold here (`isSegment` is a function), so these cases
// capture the baseline fillet behavior observed on the unfixed code and assert the
// gating rules from Requirements 3.1, 3.2, 3.3, 3.4.
describe('fillet_edges (method-form preservation)', () => {

  const close_to = 1e-9;

  // Requirements 3.1, 3.2: two segments, radius > 0, matching index -> fillet inserted,
  // endpoints mutated, arc spans the trimmed corner.
  it('fillets between two method-form segment edges and mutates endpoints', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    const next = method_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, 2, 0);

    expect(entity.inserted.length).to.equal(1);

    // The current edge's end is pulled back and the next edge's start is pushed up by
    // the fillet tangent length (observed baseline on unfixed method-form code).
    expect(edge.shape.pe.x).to.be.closeTo(8, close_to);
    expect(edge.shape.pe.y).to.be.closeTo(0, close_to);
    expect(next.shape.ps.x).to.be.closeTo(10, close_to);
    expect(next.shape.ps.y).to.be.closeTo(2, close_to);

    // Untouched endpoints remain the original corner coordinates.
    expect(edge.shape.ps.x).to.be.closeTo(0, close_to);
    expect(edge.shape.ps.y).to.be.closeTo(0, close_to);
    expect(next.shape.pe.x).to.be.closeTo(10, close_to);
    expect(next.shape.pe.y).to.be.closeTo(10, close_to);

    // The inserted fillet arc runs from the trimmed current end to the trimmed next start.
    const arc = entity.inserted[0].edge.shape;
    expect(arc.start.x).to.be.closeTo(8, close_to);
    expect(arc.start.y).to.be.closeTo(0, close_to);
    expect(arc.end.x).to.be.closeTo(10, close_to);
    expect(arc.end.y).to.be.closeTo(2, close_to);

    // The arc is inserted after the current edge.
    expect(entity.inserted[0].after).to.equal(edge);
  });

  // Requirement 3.3: radius <= 0 skips filleting and leaves endpoints untouched.
  it('skips filleting when radius is zero', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    const next = method_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, 0, 0);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
    expect(next.shape.ps).to.deep.equal({ x: 10, y: 0 });
  });

  it('skips filleting when radius is negative', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    const next = method_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, -2, 0);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
    expect(next.shape.ps).to.deep.equal({ x: 10, y: 0 });
  });

  // Requirement 3.3: a non-matching index skips the current edge.
  it('skips filleting when the index does not match the current edge', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    const next = method_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, 2, 1);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
    expect(next.shape.ps).to.deep.equal({ x: 10, y: 0 });
  });

  // Requirement 3.4: an arc (non-segment) current edge is skipped.
  it('skips filleting when the current edge is an arc', () => {
    const edge = method_edge(false, [0, 0], [10, 0]);
    const next = method_edge(true, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, 2, 0);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
    expect(next.shape.ps).to.deep.equal({ x: 10, y: 0 });
  });

  // Requirement 3.4: an arc (non-segment) next edge is skipped.
  it('skips filleting when the next edge is an arc', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    const next = method_edge(false, [10, 0], [10, 10]);
    edge.next = next;
    const entity = entity_from([edge, next]);

    fillet_edges(entity, 2, 0);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
    expect(next.shape.ps).to.deep.equal({ x: 10, y: 0 });
  });

  // Requirement 3.2: when there is no next edge, there is nothing to fillet against.
  it('skips filleting when there is no next edge', () => {
    const edge = method_edge(true, [0, 0], [10, 0]);
    edge.next = undefined;
    const entity = entity_from([edge]);

    fillet_edges(entity, 2, 0);

    expect(entity.inserted.length).to.equal(0);
    expect(edge.shape.pe).to.deep.equal({ x: 10, y: 0 });
  });

  // Requirement 3.1: index undefined fillets every qualifying consecutive segment pair.
  it('fillets every consecutive segment pair when index is undefined', () => {
    const e0 = method_edge(true, [0, 0], [10, 0]);
    const e1 = method_edge(true, [10, 0], [10, 10]);
    const e2 = method_edge(true, [10, 10], [0, 10]);
    e0.next = e1;
    e1.next = e2;
    e2.next = undefined;
    const entity = entity_from([e0, e1, e2]);

    fillet_edges(entity, 2, undefined);

    // Two interior corners get filleted; the last edge has no `next` so it is skipped.
    expect(entity.inserted.length).to.equal(2);
    expect(entity.inserted[0].after).to.equal(e0);
    expect(entity.inserted[1].after).to.equal(e1);

    // First corner: e0.pe trimmed to (8,0), e1.ps pushed to (10,2).
    expect(e0.shape.pe.x).to.be.closeTo(8, close_to);
    expect(e0.shape.pe.y).to.be.closeTo(0, close_to);
    expect(e1.shape.ps.x).to.be.closeTo(10, close_to);
    expect(e1.shape.ps.y).to.be.closeTo(2, close_to);

    // Second corner: e1.pe trimmed to (10,8), e2.ps pulled to (8,10).
    expect(e1.shape.pe.x).to.be.closeTo(10, close_to);
    expect(e1.shape.pe.y).to.be.closeTo(8, close_to);
    expect(e2.shape.ps.x).to.be.closeTo(8, close_to);
    expect(e2.shape.ps.y).to.be.closeTo(10, close_to);
  });

});

// Parity (Property 2): the fixed `fillet_edges` must produce deep-equal results whether
// each edge's `isSegment` is expressed as a method (older flatten-js) or a getter (newer
// flatten-js). This runs an identical edge chain through both forms and compares the full
// outcome - inserted arcs (computed arc start/end plus bulge/center/radius/angles), the
// mutated `shape.ps`/`shape.pe` endpoints, and the number of skipped edges.
describe('fillet_edges (method vs getter parity)', () => {

  // A geometry chain reused to build both forms: three segment edges forming two interior
  // corners, so `index === undefined` fillets two pairs and skips the final (no-next) edge.
  const chain = [
    { seg: true, ps: [0, 0], pe: [10, 0] },
    { seg: true, ps: [10, 0], pe: [10, 10] },
    { seg: true, ps: [10, 10], pe: [0, 10] },
  ];

  // Serialize a point-like object to a plain, order-stable shape for deep comparison.
  function point(p) {
    return { x: p.x, y: p.y };
  }

  // Serialize a flatten.Arc (the inserted fillet shape) to its stable numeric fields plus
  // its computed start/end points, so method-form and getter-form arcs compare structurally.
  function arc(shape) {
    return {
      center: point(shape.center),
      r: shape.r,
      startAngle: shape.startAngle,
      endAngle: shape.endAngle,
      counterClockwise: shape.counterClockwise,
      start: point(shape.start),
      end: point(shape.end),
    };
  }

  // Run `fillet_edges` over an edge chain built with the given stub factory and capture the
  // full observable outcome: mutated endpoints per edge, inserted arcs, and skip count.
  function run(make_edge) {
    const edges = chain.map((c) => make_edge(c.seg, c.ps, c.pe));
    for (let i = 0; i < edges.length - 1; i += 1) {
      edges[i].next = edges[i + 1];
    }
    edges[edges.length - 1].next = undefined;

    const entity = entity_from(edges);
    fillet_edges(entity, 2, undefined);

    return {
      endpoints: edges.map((e) => ({ ps: point(e.shape.ps), pe: point(e.shape.pe) })),
      arcs: entity.inserted.map((ins) => ({
        after_index: edges.indexOf(ins.after),
        shape: arc(ins.edge.shape),
      })),
      skips: edges.length - entity.inserted.length,
    };
  }

  // Requirements 3.1, 3.2, 3.3, 3.4, 3.5: method-form and getter-form outcomes are identical.
  it('yields deep-equal fillet results for method-form and getter-form edge chains', () => {
    const method_result = run(method_edge);
    const getter_result = run(getter_edge);

    expect(getter_result).to.deep.equal(method_result);

    // Sanity: the shared chain fillets both interior corners and skips the final edge.
    expect(method_result.arcs.length).to.equal(2);
    expect(method_result.skips).to.equal(1);
  });

});
