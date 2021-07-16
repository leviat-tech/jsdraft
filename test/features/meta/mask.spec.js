/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');
const Rectangle = require('../../../src/entities/geometric/rectangle');


describe('Mask', () => {
  const sketch = new Sketch()
    .circle([0, 0], 10)
    .circle([5, 0], 10)
    .mask(new Rectangle(0, 0, 20, 20));

  it('should add a mask to the output svg', () => {
    const svg = render(sketch, 'svg', { viewport: 'js' });
    expect(svg.length).to.eql(3);
    const mask = svg[0];
    const mask_id = mask.attributes.id;
    const e1 = svg[1];
    expect(e1.attributes.mask).to.eql(`url(#${mask_id})`);
  });

  it('should use the mask when computing extents', () => {
    const extents = sketch.extents;
    expect(extents).to.eql({ xmin: 0, xmax: 15, ymin: 0, ymax: 10 });
  });
});
