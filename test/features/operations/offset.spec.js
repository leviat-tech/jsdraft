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

  const pface2 = new Sketch()
    .polyface(
      [0, 0],
      [0, -100],
      [-100, -100],
      [[-100, -40], 20],
      [-50, 0],
    );

  const rect = new Sketch()
    .rectangle([0, 0], 10, 5);

  const pcurve2 = new Sketch()
    .polycurve(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [10, 2],
      [[15, 8], 1],
      [10, 8],
    );

  const pcurve3 = new Sketch()
    .polycurve(
      [0, -70 * 0.001],
      [0, 0],
      [-10 * 0.001, 0],
    )
    .fillet(2 * 0.001);

  it('can offset a polycurve', () => {
    const offset = pcurve.offset(0.25, false);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 0.1768, y: 0.1768 });
    expect(v[1]).to.be.a.point({ x: 0.8232, y: 0.8232 });
    expect(v[2]).to.be.a.point({ x: 3.1768, y: 3.1768 });
  });

  it('can offset a polycurve with a radius', () => {
    const pc = new Sketch()
      .polycurve(
        [0, 0],
        [0, 50],
        [-10, 50],
      ).fillet(5);

    const inset = pc.offset(4, false);
    const v = inset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: -4, y: 0 });
    expect(v[1]).to.be.a.point({ x: -4, y: 45 });
    expect(v[2]).to.be.a.point({ x: -5, y: 46 });
    expect(v[3]).to.be.a.point({ x: -10, y: 46 });
  });

  it('can offset a polyface', () => {
    const offset = pface.offset(0.5, false);
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
    const offset = arc.offset(1, false);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 0.9231, y: -0.3846 });
    expect(v[1]).to.be.a.point({ x: 5, y: -6.5 });
    expect(v[2]).to.be.a.point({ x: 9.0769, y: -0.3846 });
  });

  it('can offset a circle', () => {
    const offset = circle.offset(1, false);

    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: -9, y: 0 });
    expect(v[1]).to.be.a.point({ x: 9, y: 0 });
  });

  it('An offset can reduce the number of vertices', () => {
    const offset = pface.offset(1, false);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 1, y: 1 });
    expect(v[1]).to.be.a.point({ x: 9, y: 1 });
    expect(v[2]).to.be.a.point({ x: 9, y: 9 });
    expect(v[3]).to.be.a.point({ x: 1, y: 9 });
  });

  it('can offset a shape with bulge defined in the negative direction', () => {
    const offset = pface2.offset(1, false);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: 1, y: 0 });
    expect(v[1]).to.be.a.point({ x: 1, y: -100 });
    expect(v[2]).to.be.a.point({ x: 0, y: -101 });
    expect(v[3]).to.be.a.point({ x: -100, y: -101 });
    expect(v[4]).to.be.a.point({ x: -101, y: -100 });
    expect(v[5]).to.be.a.point({ x: -101, y: -49.6125 });
    expect(v[6]).to.be.a.point({ x: -93.1186, y: -33.2143 });
    expect(v[7]).to.be.a.point({ x: -50.6247, y: 0.7809 });
    expect(v[8]).to.be.a.point({ x: -50, y: 1 });
    expect(v[9]).to.be.a.point({ x: 0, y: 1 });
  });

  it('can offset a rectangle with sharp corners', () => {
    const offset = rect.offset(-1);
    const v = offset.shape.vertices;
    expect(v.length).to.eql(4);
  });

  it('can offset a rectangle with rounded corners', () => {
    const offset = rect.offset(-1, false);
    const v = offset.shape.vertices;
    expect(v.length).to.eql(8);
  });

  it('can apply a negative offset', () => {
    const offset = pcurve2.offset(-1);
    const v = offset.shape.vertices;
    expect(v.length).to.eql(7);
    expect(v[3]).to.be.a.point({ x: 10.3031, y: 0.8017 });
  });

  it('can offset a curve with small dimensions', () => {
    const offset = pcurve3.offset(2 * 0.001);
    const v = offset.shape.vertices;
    expect(v[0]).to.be.a.point({ x: -0.002, y: -0.07 });
    expect(v[1]).to.be.a.point({ x: -0.002, y: -0.002 });
    expect(v[2]).to.be.a.point({ x: -0.01, y: -0.002 });
  });
});
