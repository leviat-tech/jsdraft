/* global describe, it */

const { expect, use } = require('chai');
use(require('../helpers.js'));
const Sketch = require('../../src/sketch/sketch.js');
const Point = require('../../src/entities/geometric/point.js');


describe('Sketch', () => {
  const pt = new Sketch().point(3, 3);
  const pt2 = new Sketch().point(5, 5);

  const sketch = new Sketch({ entity: new Point(1, 1) })
    .point(2, 2)
    .add(pt)
    .point(4, 4)
    .add(pt2);

  it('can iterate its entities in order of insertion', () => {
    const e = [...sketch.shapes()];
    expect(e[0]).to.be.a.point({ x: 1, y: 1 });
    expect(e[1]).to.be.a.point({ x: 2, y: 2 });
    expect(e[2]).to.be.a.point({ x: 3, y: 3 });
    expect(e[3]).to.be.a.point({ x: 4, y: 4 });
    expect(e[4]).to.be.a.point({ x: 5, y: 5 });
  });

  it('can iterate its entities in level order', () => {
    const e = [...sketch.shapes('level')];
    expect(e[0]).to.be.a.point({ x: 1, y: 1 });
    expect(e[1]).to.be.a.point({ x: 2, y: 2 });
    expect(e[2]).to.be.a.point({ x: 4, y: 4 });
    expect(e[3]).to.be.a.point({ x: 3, y: 3 });
    expect(e[4]).to.be.a.point({ x: 5, y: 5 });
  });

  it('can return its most recent entity', () => {
    expect(sketch.shape).to.be.a.point({ x: 5, y: 5 });
  });

  it('can return its extents', () => {
    const extents = sketch.extents;
    expect(extents).to.eql({ xmin: 1, ymin: 1, xmax: 5, ymax: 5 });
  });

  it('can call injected custom functions from sketches resulting from custom functions', () => {
    function feature(s) { return s; }
    const root = new Sketch();
    root.inject(feature);
    const intermediate = root.new.user.feature();
    expect(intermediate.user.feature).to.not.equal(undefined);
  });

  it('index owner should refer to the sketch that owns the index', () => {
    const root = new Sketch();
    expect(root.node.index.owner()).to.equal(root);
    const derivative = root.new;
    expect(derivative.node.index.owner()).to.equal(derivative);
    const clone = Sketch.clone(root);
    expect(clone.node.index.owner()).to.equal(clone);
    const grandchild = derivative.create();
    expect(grandchild.node.index.owner()).to.equal(grandchild);
  });
});
