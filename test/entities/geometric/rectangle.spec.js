/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, assert, Assertion } = require('chai');
const flatten = require('@flatten-js/core');
const Point = require('../../../src/entities/geometric/point');
const Rectangle = require('../../../src/entities/geometric/rectangle');


Assertion.addMethod('rectangle', function (xmin, ymin, xmax, ymax) {
  new Assertion(this._obj).to.be.instanceof(Rectangle);
  new Assertion(this._obj.xmin).to.be.eql(xmin);
  new Assertion(this._obj.ymin).to.be.eql(ymin);
  new Assertion(this._obj.xmax).to.be.eql(xmax);
  new Assertion(this._obj.ymax).to.be.eql(ymax);
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
});
