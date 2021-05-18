/* global describe, it */

const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Hatch', () => {
  it('should add patterns to the svg output', () => {
    const a = new Sketch().circle([0, 0], 10).fill('red');
    const b = new Sketch().circle([10, 0], 10).hatch('crosshatch');
    const result = new Sketch().add(a, b);
    const svg = render(result, 'svg');
    const parsed = parse(svg);
    const defs = parsed.children[0].children[0].children[0];
    expect(defs.tagName).to.eql('defs');
    expect(defs.children.length).to.eql(1);
  });

  it('should allow multiple hatch types', () => {
    const a = new Sketch().rectangle([0, 0], 10, 10).hatch('lines', 1, 0, 'red');
    const b = new Sketch().rectangle([10, 0], 20, 10).hatch('lines', 1, 0, 'blue');

    const result = new Sketch().add(a, b);
    const svg = render(result, 'svg');
    const parsed = parse(svg);
    const patterns = parsed.children[0].children[0].children[0].children;
    expect(patterns.length).to.eql(2);
  });
});
