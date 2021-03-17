/* global describe, it */

const chai = require('chai');
const Sketch = require('../src/sketch/sketch.js');
const Draft = require('../src/draft.js');
const svg = require('../src/renderers/svg.js');


chai.expect();

const { expect } = chai;

describe('Point feature', () => {
  const sketch = new Sketch();
  const s = sketch.point(1, 2);
  it('will return a point entity', () => {
    expect(s.shape.x).to.eql(1);
    expect(s.shape.y).to.eql(2);
  });
});

describe('SVG renderer', () => {
  const sketch = new Sketch();

  const result = sketch
    .point([0, 0])
    .point([10, 10]);

  it('will render two points', () => {
    const rendering = svg(result);
    expect(rendering).to.contain('circle');
  });
});

describe('Draft construct', () => {

  it('should be able to parse and render a javascript sketch', () => {
    const draft = new Draft();
    draft.add_sketch('my_point', 'js', `
      function feature(sketch, a, b) {
        return sketch.point(a, b);
      }
    `);
    const result = draft.render('my_point', [3, 5], 'svg');
    expect(result).to.contain('circle');
  });

  it('should be able to parse and render a yaml sketch', () => {
    const draft = new Draft();
    draft.add_sketch('my_point', 'yaml', `
      parameters:
        - $x: 5
      reference:
        - $y: '10'
      sketch:
        - point: [$x, $y]
    `);
    const result = draft.render('my_point', [3, 5], 'svg');
    expect(result).to.contain('circle');
  });

  it('should be able to parse and render the default javascript sketch', () => {
    const draft = new Draft();
    draft.add_sketch('feature', 'js', `
    function untitled (sketch, args) {
      return sketch;
    }
    `);
    const result = draft.render('feature', [], 'svg');
    expect(result).to.contain('svg');
  });
});
