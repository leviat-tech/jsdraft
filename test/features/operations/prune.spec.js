/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Prune', () => {
  const foo = new Sketch()
    .polycurve([0, 0], [16, 16], [25, 0], [50, 0])
    .name('foo');

  const bar = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .name('bar');

  const baz = new Sketch()
    .circle([10, 10], 3)
    .name('baz');

  const sketch = new Sketch().add(foo, bar, baz);

  it('should remove nodes from a sketch', () => {
    const pruned = sketch.prune('foo');
    const children = pruned.node.children;
    expect(children.length).to.eql(2);
    expect(children.some((e) => e.node.name === 'foo')).to.eql(false);
  });

  it('should find nested nodes', () => {
    const thing = new Sketch()
      .add(foo)
      .add(bar)
      .add(baz)
      .name('bat');

    const pruned = thing.prune('baz');
    expect(pruned.entities.length).to.eql(2);
  });
});
