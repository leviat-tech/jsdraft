/* global describe, it */

const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Hatch', () => {
  const a = new Sketch().circle([0, 0], 10).fill('red');
  const b = new Sketch().circle([10, 0], 10).hatch('crosshatch');

  const result = new Sketch().add(a, b);

  it('should add patterns to the svg output', () => {
    const svg = render(result, 'svg');
    const parsed = parse(svg);
    const defs = parsed.children[0].children[0].children[0];
    expect(defs.tagName).to.eql('defs');
    expect(defs.children.length).to.eql(1);
  });
});
