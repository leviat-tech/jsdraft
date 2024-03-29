/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const AlignedDim = require('../../../src/entities/annotation/aligned-dim');
const Point = require('../../../src/entities/geometric/point');
const render = require('../../../src/render');


describe('Aligned Dim', () => {
  const dim = new AlignedDim([0, 0], [10, 5]);

  it('can be constructed from two points', () => {
    expect(dim).to.be.instanceof(AlignedDim);
    expect(dim.ps).to.be.a.point({ x: 0, y: 0 });
    expect(dim.pe).to.be.a.point({ x: 10, y: 5 });
  });

  it('can gracefully handle two coincident points', () => {
    const ptA = new Point(0, 0);
    const ptB = new Point(0, 0);
    const dim2 = new AlignedDim(ptA, ptB, [0, 5]);
    expect(dim2).to.be.instanceof(AlignedDim);
  });

  it('can be transformed', () => {
    const transformed = dim.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.ps).to.be.a.point({ x: 0, y: 0 });
    expect(transformed.pe).to.be.a.point({ x: -5, y: 10 });
  });

  it('can output an svg', () => {
    expect(render(dim, 'svg')).to.contain('text');
  });

  it('can accept a callback', () => {

  });
});
