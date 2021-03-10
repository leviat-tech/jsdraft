/* global describe, it */

const chai = require('chai');
const Sketch = require('../src/sketch/sketch.js');
const svg = require('../src/renderers/svg.js');


chai.expect();

const { expect } = chai;

describe('Sketch', () => {
  const sketch = new Sketch();

  it('can add geometry directly', () => {
    const pt = sketch.point(1, 3);
    expect(pt.shape).to.eql({ x: 1, y: 3 });
  });

  it('can chain geometry functions', () => {
    const base = sketch.point(2, 5);

    const pt = base.chain
      .point(1, 3)
      .stroke(1, 'red')
      .draw();

    const rendered = svg(pt);
    expect(rendered).to.contain('path');
  });
});
