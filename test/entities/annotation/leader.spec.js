/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers.js'));
const flatten = require('@flatten-js/core');
const Leader = require('../../../src/entities/annotation/leader.js');
const render = require('../../../src/render.js');


describe.only('Leader', () => {
  const leader = new Leader('hello, world', [5, 10], [100, -20]);

  it('can be constructed with a point and a text string', () => {
    expect(leader.ps).to.be.a.point({ x: 5, y: 10 });
    expect(leader.pe).to.be.a.point({ x: 100, y: -20 });
  });

  it('can be transformed', () => {
    const transformed = leader.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.ps).to.be.a.point({ x: -10, y: 5 });
    expect(transformed.pe).to.be.a.point({ x: 20, y: 100 });
  });

  it('can output an svg', () => {
    expect(render(leader, 'svg')).to.contain('hello, world');
  });
});
