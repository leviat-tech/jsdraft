/* global describe, it */

const { expect, use } = require('chai');
const flatten = require('@flatten-js/core');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Hide', () => {
  const sketch = new Sketch()
    .polycurve([0, 0], 1, [5, 5])
    .hide();

  const mixed = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .add(sketch);

  it('should omit hidden elements when rendering', () => {
    const svg = render(mixed, 'svg', { viewport: 'js' });
    expect(svg.length).to.eql(1);
  });

  it('should include hidden elements if indicated', () => {
    const svg = render(mixed, 'svg', { viewport: 'js', show: 'all' });
    expect(svg.length).to.eql(2);
  });

  it('should omit hidden entities from the entities list', () => {
    const entities = render(mixed, 'entities');
    expect(entities.length).to.eql(1);
  });

  it('should include hidden entities if indicated', () => {
    const entities = render(mixed, 'entities', { show: 'all' });
    expect(entities.length).to.eql(2);
  });

  it('should provide getters for hidden entities', () => {
    const e = mixed.hidden.entities;
    expect(e.length).to.eql(1);
    expect(e[0]).to.be.an.instanceof(flatten.Multiline);
  });

  it('should exclude hidden entities from standard getters', () => {
    const e = mixed.entities;
    expect(e.length).to.eql(1);
    expect(e[0]).to.be.an.instanceof(flatten.Polygon);
  });
});
