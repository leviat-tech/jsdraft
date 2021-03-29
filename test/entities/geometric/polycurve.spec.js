/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, Assertion } = require('chai');
const Polycurve = require('../../../src/entities/geometric/polycurve');


Assertion.addMethod('polycurve', function (vertices) {
  new Assertion(this._obj).to.be.instanceof(Polycurve);
  new Assertion(this._obj.vertices.length).to.eql(vertices);
});


describe('Polycurve', () => {

  it('can be constructed from segments', () => {
    const c = new Polycurve(
      [[0, 0], [1, 1]],
      [[1, 1], [2, 0]],
      [[2, 0], [5, 5]],
    );
    expect(c).to.be.a.polycurve(4);
    expect(c.vertices).to.eql([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 0 },
      { x: 5, y: 5 },
    ]);
  });

  it('can be constructed from points and bulges', () => {
    const c = new Polycurve(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [8, 2],
      1,
      [4, 0],
    );

    expect(c).to.be.a.polycurve(5);
  });

  it('can be constructed from points and fillets', () => {
    const c = new Polycurve(
      [[0, 0], 0],
      [[10, 10], 2],
      [[20, 0], 1.5],
      [[30, 10], 0],
    );
    expect(c).to.be.a.polycurve(6);
  });

  it('can be constructed from a combination of points, bulges, and fillets', () => {
    const c = new Polycurve(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [10, 2],
      [[15, 8], 1],
      [10, 8],
    );
    expect(c).to.be.a.polycurve(7);
  });
});
