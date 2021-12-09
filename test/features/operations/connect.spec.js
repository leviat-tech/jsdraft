/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');


chai.expect();

const { expect } = chai;

describe.only('Connect', () => {
  const a = new Sketch()
    .polycurve([0, 0], [10, 10]);

  const b = new Sketch()
    .polycurve(
      [-20, -20],
      [-10, 0],
      [30, 0],
    );

  const c = new Sketch().add(a, b);

  it('can connect two polycurves', () => {
    const result = a.connect(b);
    const entities = result.entities;
    expect(entities.length).to.eql(1);
    expect(entities[0]).to.be.a.polycurve(5);
    const vertices = entities[0].vertices;
    expect(vertices[0]).to.be.a.point({ x: 0, y: 0 });
    expect(vertices[1]).to.be.a.point({ x: 10, y: 10 });
    expect(vertices[2]).to.be.a.point({ x: -20, y: -20 });
    expect(vertices[3]).to.be.a.point({ x: -10, y: 0 });
    expect(vertices[4]).to.be.a.point({ x: 30, y: 0 });
  });

  it('can connect polycurves within a sketch', () => {
    const result = c.connect();
    expect(result.entities[0]).to.be.a.polycurve(5);
  });
});
