/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


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

  it('should be able to fillet a vertex', () => {
    const pcurve = sketch.fillet(3, 0).shape;
    const v = pcurve.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 13.2031, y: 13.2031 });
    expect(v[2]).to.be.a.point({ x: 17.9392, y: 12.5526 });
    expect(v[3]).to.be.a.point({ x: 25, y: 0 });
    expect(v[4]).to.be.a.point({ x: 50, y: 0 });
  });

  it('should be able to fillet a polyface vertex', () => {
    const pface = sketch2.fillet(3, 1).shape;
    const v = pface.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 16, y: 16 });
    expect(v[2]).to.be.a.point({ x: -6.9077, y: 19.5243 });
    expect(v[3]).to.be.a.point({ x: -10.3455, y: 16.8904 });
    expect(v[4]).to.be.a.point({ x: -12, y: 2 });
  });
});
