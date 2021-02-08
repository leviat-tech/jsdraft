/* global describe, it */

import chai from 'chai';
import Sketch from '../src/sketch.js';


chai.expect();

const { expect } = chai;

describe('Point', () => {
  const sketch = new Sketch();
  const result = sketch.point([5, 10]).entities();

  it('will add a point', () => {
    expect(result.length).to.eql(1);
    expect(result[0].x).to.eql(5);
    expect(result[0].y).to.eql(10);
  });

  it('can be used as a reference', () => {
    const line = sketch.line(result[0], [12, 15]);
    expect(line.curves()[0]).to.eql({
      type: 'curve',
      point_a: { type: 'point', x: 5, y: 10 },
      point_b: { type: 'point', x: 12, y: 15 },
      bulge: 0,
    });
  });
});

describe('Line', () => {
  const sketch = new Sketch();
  const result = sketch.line([0, 0], [10, 10]).entities();

  it('will add a curve', () => {
    expect(result.length).to.eql(1);
    expect(result[0].point_b).to.eql({ x: 10, y: 10, type: 'point' });
  });
});

describe('Curve', () => {
  const sketch = new Sketch();
  const result = sketch.curve([0, 0], [10, 10], 1).entities();

  it('will add a curve', () => {
    expect(result.length).to.eql(1);
    expect(result[0].bulge).to.eql(1);
  });
});

describe('Polyline', () => {
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

describe('Tag', () => {
  const sketch = new Sketch();
  const result = sketch
    .point([5, 10])
    .line([0, 0], [10, 10])
    .tag('test', (s) => s
      .point([12, 12])
      .line([2, 2], [3, -3]))
    .point([5, -5]);

  it('will add tagged geometry to the sketch', () => {
    expect(result.entities().length).to.eql(5);
  });

  it('will reference the child sketch by tag name', () => {
    expect(result.$test.entities().length).to.eql(2);
  });
});

describe('Var', () => {
  const sketch = new Sketch();
  const result = sketch
    .point([5, 10])
    .var('my_var', '3 + 10')
    .tag('my_tag', (s) => s.var('second_var', 'my_var + 5'))
    .var('third_var', 'my_tag.second_var + 1')
    .point([12, 5]);

  it('will add tagged geometry to the sketch', () => {
    expect(result.entities().length).to.eql(2);
  });

  it('will add a variable to the sketch', () => {
    expect(result.$my_var).to.eql(13);
    expect(result.$my_tag.$second_var).to.eql(18);
    expect(result.$third_var).to.eql(19);
  });
});
