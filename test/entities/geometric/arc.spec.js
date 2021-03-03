/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, Assertion } = require('chai');
const Arc = require('../../../src/entities/geometric/arc');


Assertion.addMethod('arc', function (radius) {
  new Assertion(this._obj).to.be.instanceof(Arc);
  new Assertion(this._obj.r).to.be.closeTo(radius, 0.000001);
});

describe('Arc', () => {
  it('can be constructed from center, radius, start, end, ccw', () => {
    const arc = new Arc([0, 0], 3, 0, Math.PI / 2, true);
    expect(arc).to.be.an.arc(3);
  });

  it('can be constructed from a point, point, number', () => {
    const arc = new Arc([1, 1], [5, 5], Math.PI);
    expect(arc).to.be.an.arc(5.6568542);
  });

  it('can be constructed from three points', () => {
    const arc = new Arc([0, 0], [10, 5], [15, 15]);
    expect(arc).to.be.an.arc(17.6776695);
  });

  it('can be constructed from bulge', () => {
    const arc = new Arc([0, 0], 1, [15, 15]);
    expect(arc).to.be.an.arc(10.6066017);
  });

  it('can be constructed from tangents', () => {
    const arc = new Arc([[5, 0], [0, 0]], [[0, 5], [0, 0]], 2, false);
    expect(arc).to.be.an.arc(2);
  });
});
