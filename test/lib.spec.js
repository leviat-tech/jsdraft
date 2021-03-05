/* global describe, it */

const chai = require('chai');
const Sketch = require('../src/sketch/sketch.js');
const Draft = require('../src/draft.js');
const svg_entities = require('../src/renderers/svg-entities.js');


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

describe('Entity list', () => {
  const sketch = new Sketch();

  const result = sketch.draw(
    sketch.point([0, 0]),
    sketch.point([10, 10]),
  );

  it('will render a flat list of entities', () => {
    const paths = svg_entities(result);
    expect(paths.length).to.eql(2);
  });
});

describe('Draft construct', () => {
  const draft = new Draft();

  draft.add_sketch('my_point', 'yaml', `
parameters:
  - $x: 5
reference:
  - $y: 10
sketch:
  - point: [$x, $y]
  `);

  draft.add_sketch('my_js_point', 'js', `
return function my_js_point(sketch, a = 1, b = 2) {
  return sketch
    .point(a, b);
}
  `);

  it('should be able to render any of its sketches', () => {
    const svg = draft.render('my_point', { format: 'svg-entities' }, [3]);
    expect(svg.length).to.eql(1);

    const svg2 = draft.render('my_js_point', { format: 'svg-entities' }, [3, 5]);
    expect(svg2.length).to.eql(1);
  });
});
