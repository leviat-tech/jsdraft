/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Union', () => {
  const sketch = new Sketch();

  it('Should allow a polyface to be added to another polyface', () => {
    const a = sketch.new.rectangle([0, 0], 10, 5);
    const b = sketch.new.rectangle([8, 2], 5, 3);
    const result = a.union(b);
    const v = result.shape.vertices;

    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 0, y: 5 });
    expect(v[2]).to.be.a.point({ x: 10, y: 0 });
    expect(v[3]).to.be.a.point({ x: 8, y: 5 });
    expect(v[4]).to.be.a.point({ x: 10, y: 2 });
    expect(v[5]).to.be.a.point({ x: 13, y: 2 });
  });

  it('should unify two polyfaces', () => {
    const a = sketch.new.polyface(
      [0, 0],
      [0, -100],
      [-100, -100],
      [-100, -40],
      [-50, 0],
    ).fillet(10, 2);

    const b = sketch.new.polyface(
      [0, 0],
      [0, -50],
      [10, -30],
      [10, 0],
    );

    const union = sketch.new.add(a, b).union();
    const v = union.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: -50, y: 0 });
    expect(v[2]).to.be.a.point({ x: -96.247, y: -36.9976 });
    expect(v[3]).to.be.a.point({ x: -100, y: -44.8062 });
    expect(v[4]).to.be.a.point({ x: -100, y: -100 });
    expect(v[5]).to.be.a.point({ x: 0, y: -100 });
    expect(v[6]).to.be.a.point({ x: 0, y: -50 });
    expect(v[7]).to.be.a.point({ x: 10, y: -30 });
    expect(v[8]).to.be.a.point({ x: 10, y: 0 });
  });

  it('should unify two polyfaces', () => {
    const a = sketch.new.polyface(
      [0, 0],
      [0, -100],
      [-100, -100],
      [-100, -40],
      [-50, 0],
    ).fillet(9, 2);

    const b = sketch.new.polyface(
      [0, 0],
      [0, -50],
      [10, -30],
      [10, 0],
    );

    const union = sketch.new.add(a, b).union();
    const v = union.vertices;
    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: -50, y: 0 });
    expect(v[2]).to.be.a.point({ x: -96.6223, y: -37.2978 });
    expect(v[3]).to.be.a.point({ x: -100, y: -44.3256 });
    expect(v[4]).to.be.a.point({ x: -100, y: -100 });
    expect(v[5]).to.be.a.point({ x: 0, y: -100 });
    expect(v[6]).to.be.a.point({ x: 0, y: -50 });
    expect(v[7]).to.be.a.point({ x: 10, y: -30 });
    expect(v[8]).to.be.a.point({ x: 10, y: 0 });
  });
});
