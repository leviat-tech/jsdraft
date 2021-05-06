/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const DimString = require('../../../src/entities/annotation/dim-string');
const render = require('../../../src/render');


describe.only('Aligned Dim', () => {
  const dim = new DimString([0, 0], [90, 5], [20, 40, 60]);

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
    expect(d).to.eql('M 0.27735009811261485 -4.992301766027062 L 3.0508510792387633 -54.91531942629768 M 90.27735009811262 0.00769823397293834 L 93.05085107923877 -49.91531942629768 M -2.218800784900913 -50.20036775838323 L 97.7658027471532 -44.645667562158 M 20.24655716222086 -3.8829013735766034 L 23.02005814334701 -53.80591903384722 M 40.21576422632911 -2.773500981126145 L 42.989265207455254 -52.696518641396764 M 60.18497129043735 -1.6641005886756872 L 62.9584722715635 -51.587118248946304');
  });
});
