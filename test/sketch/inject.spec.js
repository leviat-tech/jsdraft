/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, Assertion } = require('chai');
const Sketch = require('../../src/sketch/sketch.js');


function simple(sketch) {
  return sketch.point(0, 0);
}

function composed(sketch) {
  return sketch.user.simple();
}


Assertion.addMethod('render', function (entity) {
  expect(Array.from(this._obj.entities())).to.deep.include(entity);
});


describe('sketch', () => {

  it('should raise a type error when a user feature is called but has not been injected', () => {
    expect(() => composed(new Sketch())).to.throw(TypeError);
  });

  it('should be able to call an injected user feature', () => {
    const root = new Sketch();
    root.inject(simple);
    const sketch = composed(root);
    expect(sketch).to.render({ x: 0, y: 0 });
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
    expect(composed(root.clone())).to.render({ x: 0, y: 0 });
    expect(composed(root.new)).to.render({ x: 0, y: 0 });
    expect(composed(root.create())).to.render({ x: 0, y: 0 });
    expect(composed(Sketch.clone(root))).to.render({ x: 0, y: 0 });
  });
});
