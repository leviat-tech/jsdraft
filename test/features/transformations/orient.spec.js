/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Orient', () => {
  const sketch = new Sketch()
    .polycurve(
      [-20, -20],
      [-10, 0],
      [0, 0],
    );

  it('can be oriented by two points', () => {
    const result = sketch.orient([0, 0], [1, 0], [5, 5], [5, 10]);
    const vertices = result.shape.vertices;
    expect(vertices[0]).to.be.a.point({ x: 25, y: -15 });
    expect(vertices[1]).to.be.a.point({ x: 5, y: -5 });
    expect(vertices[2]).to.be.a.point({ x: 5, y: 5 });
  });

});
