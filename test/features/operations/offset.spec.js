/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Offset', () => {
  const pcurve = new Sketch()
    .polycurve(
      [0, 0],
      1,
      [1, 1],
      -1,
      [3, 3],
    );

  const pface = new Sketch()
    .polyface(
      [[0, 0], 1],
      [[10, 0], 1],
      [[10, 10], 1],
      [[0, 10], 1],
    );

  const arc = new Sketch()
    .polycurve(
      [0, 0],
      1.5,
      [10, 0],
    );

  const circle = new Sketch()
    .circle(
      [0, 0],
      10,
    );

  it('can offset a polycurve', () => {
    const offset = pcurve.offset(0.25);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 0.1768, y: 0.1768 });
    expect(v[1]).to.be.a.point({ x: 0.8232, y: 0.8232 });
    expect(v[2]).to.be.a.point({ x: 3.1768, y: 3.1768 });
  });

  it('can offset a polyface', () => {
    const offset = pface.offset(0.5);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 0.5, y: 1 });
    expect(v[1]).to.be.a.point({ x: 1, y: 0.5 });
    expect(v[2]).to.be.a.point({ x: 9, y: 0.5 });
    expect(v[3]).to.be.a.point({ x: 9.5, y: 1 });
    expect(v[4]).to.be.a.point({ x: 9.5, y: 9 });
    expect(v[5]).to.be.a.point({ x: 9, y: 9.5 });
    expect(v[6]).to.be.a.point({ x: 1, y: 9.5 });
    expect(v[7]).to.be.a.point({ x: 0.5, y: 9 });
  });

  it('can offset an arc that is greater than PI radians in arc length', () => {
    const offset = arc.offset(1);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 0.9231, y: -0.3846 });
    expect(v[1]).to.be.a.point({ x: 5, y: -6.5 });
    expect(v[2]).to.be.a.point({ x: 9.0769, y: -0.3846 });
  });

  it('can offset a circle', () => {
    const offset = circle.offset(1);

    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: -9, y: 0 });
    expect(v[1]).to.be.a.point({ x: 9, y: 0 });
  });

  it('An offset can reduce the number of vertices', () => {
    const offset = pface.offset(1);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 1, y: 1 });
    expect(v[1]).to.be.a.point({ x: 9, y: 1 });
    expect(v[2]).to.be.a.point({ x: 9, y: 9 });
    expect(v[3]).to.be.a.point({ x: 1, y: 9 });
  });
});
