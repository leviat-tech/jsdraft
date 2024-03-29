/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers'));
const Rectangle = require('../../../src/entities/geometric/rectangle');


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

  it('will remove degenerate segments', () => {
    const r = new Rectangle([0, 0], [20, 10], 5);
    expect(r).to.be.a.rectangle(0, 0, 20, 10);
    const v = r.vertices;
    expect(v.length).to.eql(6);
    expect(v[0]).to.be.a.point({ x: 0, y: 5 });
    expect(v[1]).to.be.a.point({ x: 5, y: 0 });
    expect(v[2]).to.be.a.point({ x: 15, y: 0 });
    expect(v[3]).to.be.a.point({ x: 20, y: 5 });
    expect(v[4]).to.be.a.point({ x: 15, y: 10 });
    expect(v[5]).to.be.a.point({ x: 5, y: 10 });
  });
});
