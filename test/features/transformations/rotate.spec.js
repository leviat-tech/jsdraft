/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Rotate', () => {
  const sketch = new Sketch()
    .polycurve(
      [-20, -20],
      [-10, 0],
      [0, 0],
    );

  it('can rotate by an angle provided in degrees', () => {
    const result = sketch.rotate(90);
    const vertices = result.shape.vertices;
    expect(vertices[0]).to.be.a.point({ x: 20, y: -20 });
    expect(vertices[1]).to.be.a.point({ x: -0, y: -10 });
    expect(vertices[2]).to.be.a.point({ x: 0, y: 0 });
  });

  it('can rotate by an angle provided in radians', () => {
    const result = sketch.rotate(Math.PI / 2, 'rad');
    const vertices = result.shape.vertices;
    expect(vertices[0]).to.be.a.point({ x: 20, y: -20 });
    expect(vertices[1]).to.be.a.point({ x: -0, y: -10 });
    expect(vertices[2]).to.be.a.point({ x: 0, y: 0 });
  });

  it('can rotate by a vector', () => {
    const result = sketch.rotate([0, 1]);
    const vertices = result.shape.vertices;
    expect(vertices[0]).to.be.a.point({ x: 20, y: -20 });
    expect(vertices[1]).to.be.a.point({ x: -0, y: -10 });
    expect(vertices[2]).to.be.a.point({ x: 0, y: 0 });
  });
});
