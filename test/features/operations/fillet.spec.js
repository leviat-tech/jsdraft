/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');


chai.expect();

const { expect } = chai;

describe('Fillet', () => {
  const sketch = new Sketch()
    .polycurve([0, 0], [16, 16], [25, 0], [50, 0]);

  const sketch2 = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2]);

  it('should fillet all vertices between straight edges', () => {
    const pcurve = sketch.fillet(3).shape;
    expect(pcurve.vertices.length).to.eql(6);
  });

  it('should be able to fillet a polyface', () => {
    const pface = sketch2.fillet(3).shape;
    expect(pface.vertices.length).to.eql(8);
  });
});
