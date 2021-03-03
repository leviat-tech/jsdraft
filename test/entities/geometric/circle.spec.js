/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, assert, Assertion } = require('chai');
const flatten = require('@flatten-js/core');
const Point = require('../../../src/entities/geometric/point');
const Circle = require('../../../src/entities/geometric/circle');


const p1 = new Point(0, 0);
const p2 = new Point(10, 0);
const p3 = new Point(5, 5);

Assertion.addMethod('circle', function (radius) {
  new Assertion(this._obj).to.be.instanceof(Circle);
  new Assertion(this._obj.area()).to.be.closeTo(radius ** 2 * Math.PI, 0.000001);
});


describe('Circle', () => {

  it('can be constructed from center and radius', () => {
    const c = new Circle(p1, 10);
    expect(c).to.be.a.circle(10);

  });

  it('can be constructed from two points', () => {
    const c = new Circle(p1, p2);
    expect(c).to.be.a.circle(5);
  });

  it('can be constructed from two points', () => {
    const c = new Circle(p1, p2);
    expect(c).to.be.a.circle(5);
  });

  it('can be constructed from three points', () => {
    const c = new Circle(p1, p2, p3);
    expect(c).to.be.a.circle(5);
  });

  it('can be constructed from two tangent lines and a radius', () => {
    const c = new Circle([[0, -10], [10, 0]], [[0, 10], [10, 0]], 7);
    expect(c).to.be.a.circle(7);
  });

  it('can be constructed from two tangent lines and a radius', () => {
    const c = new Circle([[0, -10], [10, 0]], [[0, 10], [10, 0]], 7);
    expect(c).to.be.a.circle(7);
    // need to test center points
    expect('').to.be.equal('We need to create a getter and test center points.');
  });

});
