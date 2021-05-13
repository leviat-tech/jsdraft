/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Interpolate', () => {
  it('should place blocks along a line', () => {
    const sketch = new Sketch()
      .polycurve(
        [-5, 0],
        [-5, 5],
        1,
        [5, 5],
        [5, 0],
      ).interpolate([0, 0], [50, 50], [10, 25, 40]);

    const pcurve = sketch.shape;
    expect(pcurve.vertices.length).to.eql(14);
  });

  it('should work with lines in reverse order', () => {
    const sketch = new Sketch()
      .polycurve(
        [0, 0],
        [0, 2],
        [5, 2],
        [5, 0],
      )
      .interpolate([0, 30], [0, 0], [0]);

    const v = sketch.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 30 });
    expect(v[1]).to.be.a.point({ x: 0, y: 30 });
    expect(v[2]).to.be.a.point({ x: 2, y: 30 });
    expect(v[3]).to.be.a.point({ x: 2, y: 25 });
    expect(v[4]).to.be.a.point({ x: 0, y: 25 });
    expect(v[5]).to.be.a.point({ x: 0, y: 0 });
  });
});
