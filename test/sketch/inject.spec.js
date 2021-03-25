/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const Sketch = require('../../src/sketch/sketch.js');
use(require('../helpers'));


function simple(sketch) {
  return sketch.point(0, 0);
}

function composed(sketch) {
  return sketch.user.simple();
}


describe('sketch', () => {

  it('should raise a type error when a user feature is called but has not been injected', () => {
    expect(() => composed(new Sketch())).to.throw(TypeError);
  });

  it('should be able to call an injected user feature', () => {
    const root = new Sketch();
    root.inject(simple);
    const sketch = composed(root);
    expect(sketch).to.have.entity({ x: 0, y: 0 });
  });

  it('injected user features should not pollute other non-derived sketches', () => {
    const one = new Sketch();
    one.inject(simple);
    const two = new Sketch();
    expect(() => composed(two)).to.throw(TypeError);
  });

  it('injected user features should be availiable on all derived sketches', () => {
    const root = new Sketch();
    root.inject(simple);
    expect(composed(root.clone())).to.have.entity({ x: 0, y: 0 });
    expect(composed(root.new)).to.have.entity({ x: 0, y: 0 });
    expect(composed(root.create())).to.have.entity({ x: 0, y: 0 });
    expect(composed(Sketch.clone(root))).to.have.entity({ x: 0, y: 0 });
  });
});
