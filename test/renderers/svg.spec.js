/* global describe, it */

const chai = require('chai');
const { parse } = require('svg-parser');
const Sketch = require('../../src/sketch/sketch.js');
const svg = require('../../src/renderers/sketch/svg.js');
const render = require('../../src/render.js');


chai.expect();

const { expect } = chai;

describe('A sketch rendered to SVG', () => {
  const sketch = new Sketch()
    .point(1, 2)
    .segment([1, 1], [10, 10])
    .arc([0, 0], 3, 0, Math.PI / 2, true)
    .circle([0, 0], 20)
    .rectangle([0, 0], 20, 20)
    .polycurve(
      [[0, 0], [1, 1]],
      [[1, 1], [2, 0]],
      [[2, 0], [5, 5]],
    )
    .polyface(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [8, 2],
    );

  const rendered = svg(sketch);
  const parsed = parse(rendered);

  it('Will render points', () => {
    const point = parsed.children[0].children[0];
    expect(point.properties.d).to.eql('M1,2 L1,2.0001');
  });

  it('Will render segments', () => {
    const segment = parsed.children[0].children[1];
    expect(segment.properties.d).to.eql('M1,1 L10,10');
  });

  it('Will render arcs', () => {
    const arc = parsed.children[0].children[2];
    expect(arc.tagName).to.eql('path');
  });

  it('Will render circles', () => {
    const circle = parsed.children[0].children[3];
    expect(circle.tagName).to.eql('path');
  });

  it('Will render rectangles', () => {
    const rectangle = parsed.children[0].children[4];
    expect(rectangle.properties.d).to.eql('\nM0,0 L20,0 L20,20 L0,20 L0,0 z');
  });

  it('Will render polycurve', () => {
    const polycurve = parsed.children[0].children[5];
    expect(polycurve.properties.d).to.eql('M0,0 L1,1 L2,0 L5,5');
  });

  it('Will render to JS', () => {
    const js = svg(sketch, { viewport: 'js' });
    expect(js.length).to.eql(7);
    expect(js[0].attributes.d).to.eql('M1,2 L1,2.0001');
  });
});

describe('Raw entities', () => {
  const sketch = new Sketch()
    .point(1, 2)
    .segment([1, 1], [10, 10])
    .arc([0, 0], 3, 0, Math.PI / 2, true)
    .circle([0, 0], 20)
    .rectangle([0, 0], 20, 20)
    .aligned_dim([0, 0], [10, 5]);

  const entities = [...sketch.entities()];
  const point = parse(render(entities[0], 'svg', { style: { stroke: { color: 'red' } } }));
  const segment = parse(render(entities[1], 'svg', { style: { fill: { color: 'blue' } } }));
  const arc = parse(render(entities[2], 'svg'));
  const circle = parse(render(entities[3], 'svg'));
  const rect = parse(render(entities[4], 'svg'));
  const dim = parse(render(entities[5], 'svg'));

  it('Can be rendered to SVG', () => {
    expect(point.children[0].tagName).to.eql('path');
    expect(point.children[0].properties.stroke).to.eql('red');
    expect(segment.children[0].tagName).to.eql('path');
    expect(segment.children[0].properties.fill).to.eql('blue');
    expect(arc.children[0].tagName).to.eql('path');
    expect(circle.children[0].tagName).to.eql('path');
    expect(rect.children[0].tagName).to.eql('path');
    expect(dim.children[0].children[0].tagName).to.eql('path');
    expect(dim.children[0].children[1].tagName).to.eql('text');
  });
});
