/* global describe, it */

const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('./helpers.js'));
const Sketch = require('../src/sketch/sketch.js');
const render = require('../src/render.js');


describe('Render', () => {
  const sketch = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .aligned_dim([-12, 2], [0, 0]);


  it('should render an svg string', () => {
    const svg = render(sketch, 'svg');
    const parsed = parse(svg);
    expect(parsed.children[0].properties.viewBox).to.eql('-12 -24 28 28');
  });

  it('should allow padding', () => {
    const svg = render(sketch, 'svg', { padding: 1 });
    const parsed = parse(svg);
    expect(parsed.children[0].properties.viewBox).to.eql('-13 -25 30 30');
  });

  it('should plot to scale', () => {
    const svg = render(sketch, 'svg', { fit: false, plot_size: 50 });
    const parsed = parse(svg);
    const svgnode = parsed.children[0];
    const textnode = parsed.children[0].children[0].children[1].children[1];
    expect(textnode.properties['font-size'].toFixed(3)).to.eql('0.600');
    expect(svgnode.properties.viewBox).to.eql('-23 -35 50 50');
  });

  it('should allow annotations to scale', () => {
    const svg = render(sketch, 'svg', { style: { annotation: { scale: 2 } } });
    const parsed = parse(svg);
    const textnode = parsed.children[0].children[0].children[1].children[1];
    expect(textnode.properties['font-size'].toFixed(3)).to.eql('0.672');
  });

  it('should allow the drawing to be scaled', () => {
    const svg = render(sketch, 'svg', { fit: false, plot_size: 100, scale: 2 });
    const parsed = parse(svg);
    const svgnode = parsed.children[0];
    expect(svgnode.properties.viewBox).to.eql('-23 -35 50 50');
  });

  it('should allow the drawing to be centered about a dfferent point', () => {
    const svg = render(sketch, 'svg', { fit: false, plot_size: 100, center: [16, 16] });
    const parsed = parse(svg);
    const svgnode = parsed.children[0];
    expect(svgnode.properties.viewBox).to.eql('-34 -66 100 100');
  });

  it('can use an aspect ratio box', () => {
    const svg = render(sketch, 'svg', { aspect_ratio: 2 });
    const parsed = parse(svg);
    expect(parsed.children[0].properties.viewBox).to.eql('-18 -20 40 20');
  });
});
