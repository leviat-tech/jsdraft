/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Subtract', () => {
  const sketch = new Sketch();
  const a = sketch.rectangle([0, 0], 10, 5);
  const b = sketch.rectangle([8, 2], 5, 3);
  const c = sketch.polycurve([3, 3], [12, 3], 1, [12, 7]);
  const d = sketch
    .segment([6.5, 2], [10.5, 6])
    .arc([12, 1], -1, [14, 3]);
  const e = sketch
    .point(0, 0)
    .point(8, 2)
    .point(9, 3)
    .point(14, 3);

  it('Should allow a polyface to be subtracted from another polyface', () => {
    const result = a.subtract(b);
    const v = result.shape.vertices;

    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 0, y: 5 });
    expect(v[2]).to.be.a.point({ x: 10, y: 0 });
    expect(v[3]).to.be.a.point({ x: 8, y: 5 });
    expect(v[4]).to.be.a.point({ x: 8, y: 2 });
    expect(v[5]).to.be.a.point({ x: 10, y: 2 });
  });

  it('Should allow a polycurve to be trimmed by a polyface', () => {
    const result = c.subtract(b);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 3, y: 3 });
    expect(v[1]).to.be.a.point({ x: 8, y: 3 });
    expect(v[2]).to.be.a.point({ x: 13, y: 3.2679 });
    expect(v[3]).to.be.a.point({ x: 12, y: 7 });
  });

  it('Should allow a segment or arc to be trimmed by a polyface', () => {
    const result = d.subtract(b);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 6.5, y: 2 });
    expect(v[1]).to.be.a.point({ x: 8, y: 3.5 });
    expect(v[2]).to.be.a.point({ x: 9.5, y: 5 });
    expect(v[3]).to.be.a.point({ x: 10.5, y: 6 });
    expect(v[4]).to.be.a.point({ x: 12, y: 1 });
    expect(v[5]).to.be.a.point({ x: 11.5858, y: 2 });
    expect(v[6]).to.be.a.point({ x: 13, y: 3.4142 });
    expect(v[7]).to.be.a.point({ x: 14, y: 3 });
  });

  it('Should allow a collection of points to be removed by a polyface', () => {
    const result = e.subtract(b);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 14, y: 3 });
    expect(v.length).to.eql(2);
  });
});
