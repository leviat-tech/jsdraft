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

describe('Polycurve feature', () => {
  const sketch = new Sketch();

  const points = [
    { point: new Point(1, 1), bulge: 0 },
    { point: new Point(3, 2), bulge: 1 },
    { point: new Point(2, 5), bulge: 0 },
  ];

  const s = sketch.polycurve(points, false);

  it('will return a multiline entity', () => {
    const vertices = s.shape.vertices;
    expect(vertices[1]).to.eql({ x: 3, y: 2 });
    expect(vertices[2]).to.eql({ x: 2, y: 5 });
  });
});

describe('Polyline feature', () => {
  const sketch = new Sketch();

  const points = [
    { point: new Point(0, 0) },
    { point: new Point(5, 5), fillet: 1 },
    { point: new Point(10, 0) },
  ];

  const s = sketch.polyline(points);

  it('will return a multiline entity', () => {
    const vertices = s.shape.vertices;
    expect(vertices[1].x.toPrecision(3)).to.eql('4.29');
    expect(vertices[1].y.toPrecision(3)).to.eql('4.29');
    expect(vertices[2].x.toPrecision(3)).to.eql('5.71');
    expect(vertices[2].y.toPrecision(3)).to.eql('4.29');
  });
});
