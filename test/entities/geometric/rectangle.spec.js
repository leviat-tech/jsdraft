/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use, Assertion } = require('chai');
use(require('../../helpers'));
const Rectangle = require('../../../src/entities/geometric/rectangle');


Assertion.addMethod('rectangle', function rect(xmin, ymin, xmax, ymax) {
  new Assertion(this._obj).to.be.instanceof(Rectangle);
  new Assertion(this._obj.xmin).to.be.closeTo(xmin, 0.00001);
  new Assertion(this._obj.ymin).to.be.closeTo(ymin, 0.00001);
  new Assertion(this._obj.xmax).to.be.closeTo(xmax, 0.00001);
  new Assertion(this._obj.ymax).to.be.closeTo(ymax, 0.00001);
});


describe('Rectangle', () => {

  it('can be constructed from boundaries', () => {
    const r = new Rectangle(0, 0, 10, 10);
    expect(r).to.be.a.rectangle(0, 0, 10, 10);
  });

  it('can be constructed from origin and dimensions', () => {
    const r = new Rectangle([0, 0], 10, 10);
    expect(r).to.be.a.rectangle(0, 0, 10, 10);
  });

  it('can be constructed from corners', () => {
    const r = new Rectangle([0, 0], [10, 10]);
    expect(r).to.be.a.rectangle(0, 0, 10, 10);
  });

  it('can be constructed from edge', () => {
    const r = new Rectangle([[0, 10], [0, 0]], 10);
    expect(r).to.be.a.rectangle(0, 0, 10, 10);
  });

  it('can be constructed with a corner radius', () => {
    const r = new Rectangle([0, 0], [20, 10], 1);
    expect(r).to.be.a.rectangle(0, 0, 20, 10);
    const v = r.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 1 });
    expect(v[1]).to.be.a.point({ x: 1, y: 0 });
    expect(v[2]).to.be.a.point({ x: 19, y: 0 });
    expect(v[3]).to.be.a.point({ x: 20, y: 1 });
    expect(v[4]).to.be.a.point({ x: 20, y: 9 });
    expect(v[5]).to.be.a.point({ x: 19, y: 10 });
    expect(v[6]).to.be.a.point({ x: 1, y: 10 });
    expect(v[7]).to.be.a.point({ x: 0, y: 9 });
  });
});
