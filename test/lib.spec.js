/* global describe, it */

import chai from 'chai';
import Sketch from '../src/sketch.js';


chai.expect();

const { expect } = chai;

describe('Point feature', () => {
  const sketch = new Sketch();
  const result = sketch.point([5, 10]).entities();

  it('will add a point', () => {
    expect(result.length).to.eql(1);
    expect(result[0].x).to.eql(5);
    expect(result[0].y).to.eql(10);
  });
});

describe('Line feature', () => {
  const sketch = new Sketch();
  const result = sketch.line([0, 0], [10, 10]).entities();

  it('will add a curve', () => {
    expect(result.length).to.eql(1);
    expect(result[0].point_b).to.eql({ x: 10, y: 10, type: 'point' });
  });
});

describe('Curve feature', () => {
  const sketch = new Sketch();
  const result = sketch.curve([0, 0], [10, 10], 1).entities();

  it('will add a curve', () => {
    expect(result.length).to.eql(1);
    expect(result[0].bulge).to.eql(1);
  });
});

describe('Polyline feature', () => {
  const sketch = new Sketch();
  const pts = [
    [[0, 0], 0.5],
    [[10, 5], 0.5],
    [15, 10],
  ];

  const result = sketch.polyline(pts).entities();

  it('will add a polycurve', () => {
    expect(result.length).to.eql(1);
    expect(result[0].type).to.eql('polycurve');
  });
});
