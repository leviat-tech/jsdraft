/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');


chai.expect();

const { expect } = chai;

describe('Interpolate', () => {
  const sketch = new Sketch()
    .polycurve(
      [-5, 0],
      [-5, 5],
      1,
      [5, 5],
      [5, 0],
    ).interpolate([0, 0], [50, 50], [10, 25, 40]);

  it('should place blocks along a line', () => {
    const pcurve = sketch.shape;
    expect(pcurve.vertices.length).to.eql(14);
  });
});
