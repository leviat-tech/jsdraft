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
    expect(bar.properties.fill).to.eql('url(#lines--2092888369)');
    expect(baz.properties.fill).to.eql('url(#lines-640369507)');
  });
});
