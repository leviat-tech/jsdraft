/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const DimString = require('../../../src/entities/annotation/dim-string');
const render = require('../../../src/render');


describe('Aligned Dim', () => {
  const dim = new DimString([0, 0], [90, 5], [20, 40, 60]);
  const dim2 = new DimString([0, 0], [-5, 90], [30]);
  const dim3 = new DimString([5, 90], [0, 0], [30], 'right');

  it('can be constructed from two points', () => {
    expect(dim).to.be.instanceof(DimString);
    expect(dim.ps).to.be.a.point({ x: 0, y: 0 });
    expect(dim.pe).to.be.a.point({ x: 90, y: 5 });
  });

  it('can be transformed', () => {
    const transformed = dim.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.ps).to.be.a.point({ x: 0, y: 0 });
    expect(transformed.pe).to.be.a.point({ x: -5, y: 90 });
  });

  it('can output an svg', () => {
    const svg = render(dim, 'svg');
    const parsed = parse(svg);
    const d = parsed.children[0].children[0].properties.d;
    expect(d).to.eql('M -0.27735009811261424 4.992301766027062 L -3.0508510792387566 54.91531942629768 M 89.72264990188738 9.992301766027062 L 86.94914892076125 59.91531942629768 M -7.765802747153204 49.645667562158 L 92.2188007849009 55.20036775838323 M 19.691856965995633 6.10170215847752 L 16.91835598486949 56.02471981874814 M 39.66106403010388 7.211102550927978 L 36.88756304897774 57.13412021119859 M 59.63027109421213 8.320502943378436 L 56.856770113085986 58.24352060364905');
  });

  it('will flip dimensions to be right-side up', () => {
    const svg2 = render(dim2, 'svg');
    const svg3 = render(dim3, 'svg');
    const parsed2 = parse(svg2);
    const parsed3 = parse(svg3);
    const r2 = parsed2.children[0].children[1].properties.rotation;
    const r3 = parsed3.children[0].children[1].properties.rotation;
    expect(Math.abs(r2)).to.be.below(90);
    expect(Math.abs(r3)).to.be.below(90);
  });
});
