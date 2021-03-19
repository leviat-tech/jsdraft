/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');


chai.expect();

const { expect } = chai;

describe('Explode', () => {
  const sketch = new Sketch()
    .polycurve(
      [-20, -20],
      [-10, 0],
      [0, 0],
    )
    .polyface(
      [20, 20],
      [0, 25],
      1,
      [15, 35],
    );

  it.only('can explode polycurves into segments', () => {
    const result = sketch.explode();
    const e = [...result.entities()];
    expect(e.length).to.eql(5);
    expect(e[0].ps).to.eql({ x: -20, y: -20 });
    expect(e[0].pe).to.eql({ x: -10, y: 0 });
  });
});
