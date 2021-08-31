/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Add attribute', () => {
  const sketch = new Sketch()
    .circle([0, 0], 10)
    .add_attribute('foo', 'bar')
    .circle([5, 0], 10)
    .add_attribute('baz', 'bat');

  it('should add an attribute to a sketch', () => {
    const attributes = sketch.attributes;
    expect(attributes.foo).to.eql('bar');
    expect(attributes.baz).to.eql('bat');
  });
});
