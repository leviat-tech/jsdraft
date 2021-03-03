/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const Arc = require('../../../src/entities/geometric/arc');


// matches(args, 'point', 'number', 'number', 'number', '...');

describe('Arc', () => {
  it('can be constructed from center, radius, start, end, ccw', () => {
    const arc = new Arc([0, 0], 3, 0, Math.PI / 2, true);
    expect(arc).to.be.instanceof(Arc);
  });

  it('can be constructed from a point, point, number', () => {
    const arc = new Arc([1, 1], [5, 5], Math.PI);
    expect(arc).to.be.instanceof(Arc);
  });

  it('can be constructed from three points', () => {
    const arc = new Arc([0, 0], [10, 5], [15, 15]);
    expect(arc).to.be.instanceof(Arc);
  });

  it('can be constructed from bulge', () => {
    const arc = new Arc([0, 0], 1, [15, 15]);
    expect(arc).to.be.instanceof(Arc);
  });

  it('can be constructed from tangents', () => {
    const arc = new Arc([[0, 0], [5, 0]], [[0, 0], [0, 5]], 2);
  });
});
