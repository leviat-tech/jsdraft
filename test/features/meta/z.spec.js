/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Z', () => {
  const a = new Sketch().circle([0, 0], 10).fill('red');
  const b = new Sketch().circle([5, 0], 10).fill('green').z(2);
  const c = new Sketch().circle([10, 0], 10).fill('blue');

  const result = new Sketch().add(a, b, c);

  it('should order sibling elements by z-index', () => {
    const svg = render(result, 'svg', { viewport: 'js' });
    expect(svg[2].attributes.fill).to.eql('green');
  });
});
