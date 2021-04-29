/* global describe, it */

const { expect, use } = require('chai');
const flatten = require('@flatten-js/core');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Hide', () => {
  const h1 = new Sketch()
    .polycurve([0, 0], 1, [5, 5])
    .hide();

  const h2 = new Sketch()
    .polycurve([-5, 5], [[-10, 10], 1], [-5, 15])
    .hide()
    .name('curve2');

  const mixed = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .add(h1, h2);

  it('should omit hidden elements when rendering', () => {
    const svg = render(mixed, 'svg', { viewport: 'js' });
    expect(svg.length).to.eql(1);
  });

  it('should include hidden elements if indicated', () => {
    const svg = render(mixed, 'svg', { viewport: 'js', show: 'all' });
    expect(svg.length).to.eql(3);
  });

  it('should omit hidden entities from the entities list', () => {
    const entities = render(mixed, 'entities');
    expect(entities.length).to.eql(1);
  });

  it('should include hidden entities if indicated', () => {
    const entities = render(mixed, 'entities', { show: 'all' });
    expect(entities.length).to.eql(3);
  });

  it('should provide getters for hidden entities', () => {
    const e = mixed.hidden.entities;
    expect(e.length).to.eql(2);
    expect(e[0]).to.be.an.instanceof(flatten.Multiline);
  });

  it('should exclude hidden entities from standard getters', () => {
    const e = mixed.entities;
    expect(e.length).to.eql(1);
    expect(e[0]).to.be.an.instanceof(flatten.Polygon);
    const p1 = mixed.hidden.vertex('last');
    expect(p1).to.be.a.point({ x: -5, y: 15 });
    const p2 = mixed.vertex('last');
    expect(p2).to.be.a.point({ x: -12, y: 2 });
  });

  it('should allow queries of hidden elements', () => {
    const none = mixed.find((s) => s.node.name === 'curve2');
    expect(none).to.eql(null);
    const h = mixed.hidden.find((s) => s.node.name === 'curve2');
    const v = h.vertices;
    expect(v[0]).to.be.a.point({ x: -5, y: 5 });
    expect(v[1]).to.be.a.point({ x: -9.2929, y: 9.2929 });
    expect(v[2]).to.be.a.point({ x: -9.2929, y: 10.7071 });
    expect(v[3]).to.be.a.point({ x: -5, y: 15 });
  });
});
