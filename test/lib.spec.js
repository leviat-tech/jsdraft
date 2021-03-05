/* global describe, it */

const chai = require('chai');
const Sketch = require('../src/sketch/sketch.js');


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
