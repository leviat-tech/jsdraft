/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Close', () => {
  const sketch = new Sketch()
    .polycurve([0, 0], [16, 16], [25, 0], [50, 0])
    .polycurve([-8, -8], [-8, -20], [0, -20]);

  it('should close all open polycurves in a sketch', () => {
    const closed = sketch.close();
    const entities = closed.entities;
    expect(entities.length).to.eql(2);
    expect(entities[0]).to.be.a.polyface(4);
    expect(entities[1]).to.be.a.polyface(3);
  });

  it('should allow closing with a bulge', () => {
    const closed = sketch.close(1);
    const first = closed.entities[0];
    const edges = [...first.edges].map((e) => e.shape);
    expect(edges[3]).to.be.an.arc(25);
  });
});
