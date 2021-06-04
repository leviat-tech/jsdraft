/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers.js'));
const flatten = require('@flatten-js/core');
const { parse } = require('svg-parser');
const DiameterDim = require('../../../src/entities/annotation/diameter-dim.js');
const Arc = require('../../../src/entities/geometric/arc.js');
const Circle = require('../../../src/entities/geometric/circle.js');
const render = require('../../../src/render.js');


describe('Diameter Dim', () => {
  it('can be constructed with a center, radius, and a point', () => {
    const dim = new DiameterDim([0, 0], 3, [5, 5]);
    expect(dim.pc).to.be.a.point({ x: 0, y: 0 });
    expect(dim.pt).to.be.a.point({ x: 5, y: 5 });
    expect(dim.d).to.eql(3);
  });

  it('can be constructed with an arc and a point', () => {
    const arc = new Arc([0, 0], 1, [3, 0]);
    const dim = new DiameterDim(arc, [3, 5]);
    expect(dim.pc).to.be.a.point({ x: 1.5, y: 0 });
    expect(dim.pt).to.be.a.point({ x: 3, y: 5 });
    expect(dim.d).to.eql(3);
  });

  it('can be constructed with a circle and a point', () => {
    const circle = new Circle([1.5, 0], 1.5);
    const dim = new DiameterDim(circle, [3, 5]);
    expect(dim.pc).to.be.a.point({ x: 1.5, y: 0 });
    expect(dim.pt).to.be.a.point({ x: 3, y: 5 });
    expect(dim.d).to.eql(3);
  });

  it('can be transformed', () => {
    const dim = new DiameterDim([0, 0], 3, [5, 5]);
    const transformed = dim.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.pc).to.be.a.point({ x: 0, y: 0 });
    expect(transformed.pt).to.be.a.point({ x: -5, y: 5 });
  });

  it('can output an svg', () => {
    const dim = new DiameterDim([0, 0], 10, [50, 50]);
    const rendered = render(dim, 'svg');
    const parsed = parse(rendered);
    const path = parsed.children[0].children[0].properties.d;
    expect(path).to.eql('M -3.5355339059327378 -3.5355339059327378 L 50 50 L 55 50 M -2.2414386804201336 1.2940952255126037 L -3.5355339059327378 -3.5355339059327378 L 1.2940952255126037 -2.2414386804201336');
  });
});
