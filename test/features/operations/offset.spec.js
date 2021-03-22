/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');


chai.expect();

const { expect } = chai;

const round_points = (vertex) => ({
  x: parseFloat(vertex.x.toFixed(3), 10),
  y: parseFloat(vertex.y.toFixed(3), 10),
});

describe('Offset', () => {
  const pcurve = new Sketch()
    .polycurve(
      [0, 0],
      1,
      [1, 1],
      -1,
      [3, 3],
    );

  const pface = new Sketch()
    .polyface(
      [[0, 0], 1],
      [[10, 0], 1],
      [[10, 10], 1],
      [[0, 10], 1],
    );

  it('can offset a polycurve', () => {
    const offset = new Sketch()
      .offset(pcurve.shape, 0.25);
    const v = offset.shape.vertices.map(round_points);
    expect(v[0]).to.eql({ x: 0.177, y: 0.177 });
    expect(v[1]).to.eql({ x: 0.823, y: 0.823 });
    expect(v[2]).to.eql({ x: 3.177, y: 3.177 });
  });

  it('can offset a polyface', () => {
    const offset = new Sketch()
      .offset(pface.shape, 0.5);
    const v = offset.shape.vertices.map(round_points);
    expect(v[0]).to.eql({ x: 0.5, y: 1 });
    expect(v[1]).to.eql({ x: 1, y: 0.5 });
    expect(v[2]).to.eql({ x: 9, y: 0.5 });
    expect(v[3]).to.eql({ x: 9.5, y: 1 });
    expect(v[4]).to.eql({ x: 9.5, y: 9 });
    expect(v[5]).to.eql({ x: 9, y: 9.5 });
    expect(v[6]).to.eql({ x: 1, y: 9.5 });
    expect(v[7]).to.eql({ x: 0.5, y: 9 });
  });

  it('An offset can reduce the number of vertices', () => {
    const offset = new Sketch()
      .offset(pface.shape, 1);
    const v = offset.shape.vertices.map(round_points);
    expect(v[0]).to.eql({ x: 1, y: 1 });
    expect(v[1]).to.eql({ x: 9, y: 1 });
    expect(v[2]).to.eql({ x: 9, y: 9 });
    expect(v[3]).to.eql({ x: 1, y: 9 });
  });
});
