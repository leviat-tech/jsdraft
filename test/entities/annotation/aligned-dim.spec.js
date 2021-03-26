/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const AlignedDim = require('../../../src/entities/annotation/aligned-dim');


const round_point = (point) => ({
  x: parseFloat(point.x.toFixed(3), 10),
  y: parseFloat(point.y.toFixed(3), 10),
});

describe('Arc', () => {
  const dim = new AlignedDim([0, 0], [10, 5]);

  it('can be constructed from two points', () => {
    expect(dim).to.be.instanceof(AlignedDim);
    expect(dim.ps).to.eql({ x: 0, y: 0 });
    expect(dim.pe).to.eql({ x: 10, y: 5 });
  });

  it('can be transformed', () => {
    const transformed = dim.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(round_point(transformed.ps)).to.eql({ x: 0, y: 0 });
    expect(round_point(transformed.pe)).to.eql({ x: -5, y: 10 });
  });

  it('can output an svg', () => {
    expect(dim.svg()).to.contain('text');
  });
});
