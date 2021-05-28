/* global describe, it */

const { expect, use } = require('chai');
const { parse } = require('svg-parser');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');
const render = require('../../../src/render.js');


describe('Style', () => {
  const sketch = new Sketch();
  sketch.node.styles = {
    foo: {
      fill: { color: 'red' },
    },
    bar: {
      fill: {
        hatch: 'lines',
        hatch_color: 'blue',
      },
    },
    baz: {
      fill: {
        hatch: 'lines',
        hatch_color: 'orange',
      },
    },
    bat: {
      fill: {
        hatch: 'lines',
        hatch_color: 'orange',
        hatch_scale: 2,
      },
    },
  };

  it('should allow selection of a predefined style', () => {
    const a = sketch.circle([0, 0], 10).style('foo');
    const b = sketch.circle([10, 0], 10).style('bar');
    const c = sketch.circle([20, 0], 10).style('baz');

    const result = sketch.add(a, b, c);
    const svg = render(result, 'svg');
    const parsed = parse(svg);
    const patterns = parsed.children[0].children[0].children[0].children;
    expect(patterns.length).to.eql(2);

    const foo = parsed.children[0].children[0].children[1];
    const bar = parsed.children[0].children[0].children[2];
    const baz = parsed.children[0].children[0].children[3];
    expect(foo.properties.fill).to.eql('red');
    expect(bar.properties.fill).to.eql('url(#lines--1221026637)');
    expect(baz.properties.fill).to.eql('url(#lines-1214774343)');
  });

  it('should allow hatch scale to scale by model unit', () => {
    const a = sketch.circle([0, 0], 10).style('baz');
    const b = sketch.circle([10, 0], 10).style('bat');

    const result = sketch.add(a, b);
    const svg = render(result, 'svg');
    const parsed = parse(svg);
    const patterns = parsed.children[0].children[0].children[0].children;

    const m_svg = render(result, 'svg', { model_unit: 'm' });
    const m_parsed = parse(m_svg);
    const m_patterns = m_parsed.children[0].children[0].children[0].children;

    expect(patterns[0].properties.patternTransform).to.eql('rotate(45) scale(1 1)');
    expect(patterns[1].properties.patternTransform).to.eql('rotate(45) scale(2 2)');
    expect(m_patterns[0].properties.patternTransform).to.eql('rotate(45) scale(0.001 0.001)');
    expect(m_patterns[1].properties.patternTransform).to.eql('rotate(45) scale(0.002 0.002)');
  });
});
