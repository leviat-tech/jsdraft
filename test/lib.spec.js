/* global describe, it */

const chai = require('chai');
const Sketch = require('../src/sketch/sketch.js');
const Point = require('../src/entities/geometric/point.js');


chai.expect();

const { expect } = chai;

describe('Point feature', () => {
  const sketch = new Sketch();
  const s = sketch.point(1, 2);
  it('will return a point entity', () => {
    expect(s.shape.x).to.eql(1);
    expect(s.shape.y).to.eql(2);
  });
});

describe('Polyline with bulge feature', () => {
  const sketch = new Sketch();

  const s = sketch.polyline(
    { point: new Point(1, 1), bulge: 0 },
    { point: new Point(3, 2), bulge: 1 },
    { point: new Point(2, 5), bulge: 0 },
  );

  it('will return a polyline entity', () => {
    const vertices = s.shape.vertices;
    expect(vertices[1]).to.eql({ x: 3, y: 2 });
    expect(vertices[2]).to.eql({ x: 2, y: 5 });
  });
});

describe('Polyline with fillet feature', () => {
  const sketch = new Sketch();

  const s = sketch.polyline_fillet(
    { point: new Point(0, 0) },
    { point: new Point(5, 5), fillet: 1 },
    { point: new Point(10, 0) },
  );

  it('will return a polyline entity', () => {
    const vertices = s.shape.vertices;
    expect(vertices[1].x.toPrecision(3)).to.eql('4.29');
    expect(vertices[1].y.toPrecision(3)).to.eql('4.29');
    expect(vertices[2].x.toPrecision(3)).to.eql('5.71');
    expect(vertices[2].y.toPrecision(3)).to.eql('4.29');
  });
});

describe('Polyline with segments feature', () => {
  const sketch = new Sketch();

  const s = sketch.polyline_segments(
    [1, 1, 2, 2],
    [2, 2, 10, 10],
  );

  it('will return a polyline entity', () => {
    const vertices = s.shape.vertices;
    expect(vertices[0].x).to.eql(1);
    expect(vertices[0].y).to.eql(1);
    expect(vertices[1].x).to.eql(2);
    expect(vertices[1].y).to.eql(2);
  });
});
