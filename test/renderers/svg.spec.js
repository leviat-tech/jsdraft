/* global describe, it */

const chai = require('chai');
const { parse } = require('svg-parser');
const Sketch = require('../../src/sketch/sketch.js');
const svg = require('../../src/renderers/svg.js');


chai.expect();

const { expect } = chai;

describe('SVG', () => {
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
    expect(point.properties.fill).to.eql('white');
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
});
