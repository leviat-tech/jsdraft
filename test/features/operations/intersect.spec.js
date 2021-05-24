/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Intersect', () => {
  const sketch = new Sketch();
  const a = sketch.rectangle([0, 0], 10, 5);
  const b = sketch.polycurve([1, 1], [6, 6], [12, 1]);
  const c = sketch.segment([5, 7], [5, -2]);
  const d = sketch.arc([2, -1], 1, [-1, -1]);
  const e = sketch.polycurve([2, 3], 1, [4, 3], [5, 6], -1, [7, 6], [8, 3]);
  const f = sketch.segment([-1, -1], [20, 20]);
  const g = sketch.polycurve([-1, -1], [3, 3], [7, 3], [11, -1]);

  it('Should allow a polyface to be intersected with a polycurve', () => {
    const result = a.intersect(b);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 5, y: 5 });
    expect(v[1]).to.be.a.point({ x: 10, y: 2.6667 });
    expect(v[2]).to.be.a.point({ x: 7.2, y: 5 });
  });

  it('Should allow a polyface to be intersected with a segment', () => {
    const result = a.intersect(c);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 5, y: 0 });
    expect(v[1]).to.be.a.point({ x: 5, y: 5 });
  });

  it('Should allow a polyface to be intersected with an arc', () => {
    const result = a.intersect(d);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 1.618, y: 0 });
    expect(v[1]).to.be.a.point({ x: 0, y: 0.4142 });
  });

  it('should allow a polycurve to be intersected with another polycurve', () => {
    const result = b.intersect(e);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 2.2929, y: 2.2929 });
    expect(v[1]).to.be.a.point({ x: 4.5, y: 4.5 });
    expect(v[2]).to.be.a.point({ x: 7.3846, y: 4.8462 });
  });

  it('should allow two polyfaces to be intersected', () => {
    const result = a.intersect(g);
    const v = result.vertices;

    expect(v.length).to.eql(2);
    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 10, y: 0 });
  });

  it('should detect a single intersection at a vertex', () => {
    const result = a.intersect(f);
    const v = result.vertices;

    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v.length).to.eql(2);
  });
});
