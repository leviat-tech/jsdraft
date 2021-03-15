/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');
const Polycurve = require('../../../src/entities/geometric/polycurve.js');


chai.expect();

const { expect } = chai;

describe('Fillet', () => {
  const a = new Polycurve([0, 0], [15, 15]);
  const b = new Polycurve([16, 16], [25, 0], [50, 0]);

  const sketch = new Sketch()
    .fillet(3, a, b);

  it('should place blocks along a line', () => {
    const pcurve = sketch.shape;
    expect(pcurve.vertices.length).to.eql(5);
  });
});
