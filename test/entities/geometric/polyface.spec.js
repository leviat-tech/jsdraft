/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Rectangle = require('../../../src/entities/geometric/rectangle');
const Polycurve = require('../../../src/entities/geometric/polycurve');
const Polyface = require('../../../src/entities/geometric/polyface');


describe('Polyface', () => {

  it('can be constructed from a polyface', () => {
    const c = new Polyface(new Rectangle(0, 0, 1, 1));
    const v = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    expect(c).to.be.a.polyface(v);
    expect(new Polyface(c)).to.be.a.polyface(v);
  });

  it('can be constructed from a polycurve', () => {
    const v = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    const pc = new Polycurve(...v);
    const pf = new Polyface(pc);
    expect(pf).to.be.a.polyface(v);
  });

  it('can be constructed from segments', () => {
    const c = new Polyface(
      [[0, 0], [1, 1]],
      [[1, 1], [2, 0]],
      [[2, 0], [5, 5]],
    );
    expect(c).to.be.a.polyface([
      [0, 0],
      [1, 1],
      [2, 0],
      [5, 5],
    ]);
  });

  it('can be constructed from points and bulges', () => {
    const c = new Polyface(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [8, 2],
      1,
      [4, 0],
    );
    expect(c).to.be.a.polyface(5);
  });

  it('can be constructed from points and fillets', () => {
    const c = new Polyface(
      [[0, 0], 0],
      [[10, 10], 2],
      [[20, 0], 1.5],
      [[30, 10], 0],
    );
    expect(c).to.be.a.polyface(6);
  });

  it('can fillet the initial vertex', () => {
    const c = new Polyface(
      [[0, 0], 1],
      [[10, 0], 1],
      [[10, 10], 1],
      [[0, 10], 1],
    );
    expect(c).to.be.a.polyface(8);
  });
});
