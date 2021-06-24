/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers'));
const flatten = require('@flatten-js/core');
const Text = require('../../../src/entities/annotation/text');
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render');


describe('Text', () => {
  const text = new Text('hello, world', [5, 10]);

  it('can be constructed a point and a text string', () => {
    expect(text.p).to.be.a.point({ x: 5, y: 10 });
  });

  it('can be transformed', () => {
    const transformed = text.transform(flatten.matrix().rotate(Math.PI / 2));
    expect(transformed.p).to.be.a.point({ x: -10, y: 5 });
  });

  it('can be transformed through the transform functions', () => {
    const s = new Sketch().text('hello').rotate(30).translate(100, 0);
    const result = render(s, 'svg', { viewport: 'js' });
    expect(result[0].attributes.transform).to.contain('matrix');
  });

  it('can output an svg', () => {
    expect(render(text, 'svg')).to.contain('hello, world');
  });
});
