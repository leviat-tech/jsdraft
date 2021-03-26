/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const Text = require('../../../src/entities/annotation/text');


describe('Text', () => {
  const text = new Text('hello, world', [5, 10]);

  it('can be constructed a point and a text string', () => {
    expect(text.p).to.be.a.point({ x: 5, y: 10 });
  });

  it('can be transformed', () => {
    const transformed = text.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.p).to.be.a.point({ x: -10, y: 5 });
  });

  it('can output an svg', () => {
    expect(text.svg()).to.contain('hello, world');
  });
});
