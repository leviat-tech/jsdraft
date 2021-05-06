/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const AngleDim = require('../../../src/entities/annotation/angle-dim');
const render = require('../../../src/render');


describe('Aligned Dim', () => {
  const dim = new AngleDim([0, 0], [100, 0], 30);

  it('can be constructed from two points', () => {
    expect(dim).to.be.instanceof(AngleDim);
    expect(dim.ps).to.be.a.point({ x: 0, y: 0 });
    expect(dim.pe).to.be.a.point({ x: 100, y: 0 });
    expect(dim.angle).to.eql(30);
  });

  it('can be transformed', () => {
    const transformed = dim.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.ps).to.be.a.point({ x: 0, y: 0 });
    expect(transformed.pe).to.be.a.point({ x: 0, y: 100 });
  });

  it('can output an svg', () => {
    const svg = render(dim, 'svg');
    const parsed = parse(svg);
    expect(parsed.children[0].children[0].properties.d).to.eql('M 95 0 L 105 0 M 82.27241335952168 47.49999999999999 L 90.93266739736606 52.49999999999999 M 100 0 A 100 100 0 0 1 86.60254037844388 49.99999999999999');
  });
});
