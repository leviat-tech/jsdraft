/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Point = require('../../../src/entities/geometric/point');
const Circle = require('../../../src/entities/geometric/circle');


const p1 = new Point(0, 0);
const p2 = new Point(10, 0);
const p3 = new Point(5, 5);

describe('Circle', () => {

  it('can be constructed from center and radius', () => {
    const c = new Circle(p1, 10);
    expect(c).to.be.a.circle(10);
  });

  it('has a radius getter', () => {
    expect(new Circle(p1, 5).radius).to.be.eql(5);
    expect(new Circle(p2, 100).radius).to.be.eql(100);
    expect(new Circle(p3, 123456789).radius).to.be.eql(123456789);
  });

  it('has a center getter', () => {
    let pt = new Point(0, 0);
    expect(new Circle(pt, 5).center).to.be.eql(pt);
    pt = new Point(100, -100);
    expect(new Circle(pt, 5).center).to.be.eql(pt);
    pt = new Point(-123, 123);
    expect(new Circle(pt, 5).center).to.be.eql(pt);
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
  });

});
