/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const Point = require('../../../src/entities/geometric/point');
const Segment = require('../../../src/entities/geometric/segment');


// matches(args, 'point', 'number', 'number', 'number', '...');

const pa = new Point(1, 2);
const pb = new Point(3, 4);

function perpendicular(a, b) {
  const v_a = flatten.vector(a.start, a.end);
  const v_b = flatten.vector(b.start, b.end);
  return v_a.dot(v_b) === 0;
}

describe('Segment', () => {

  it('can be constructed from two points', () => {
    expect(new Segment([1, 1], [2, 3])).to.be.instanceof(Segment);
  });

  it.only('can be constructed from perpendicular', () => {
    const seg = new Segment([0, 0], [10, 0]);
    const pt = new Point(0, 5);
    const perp = new Segment(seg, pt);
    // result is a segment
    expect(perp).to.be.instanceof(Segment);
    // segments are perpendicular
    expect(perpendicular(seg, perp)).to.be.equal(true);
    // start is on segment
    expect(seg.distanceTo(perp.start)[0]).to.be.eql(0);
    // end is on point
    expect(perp.end).to.be.eql(pt);
  });

  it.only('perpendicular constructions are shifted onto segment', () => {
    const seg = new Segment([0, 0], [10, 0]);
    const pt = new Point(-1, 5);
    const perp = new Segment(seg, pt);
    // result is a segment
    expect(perp).to.be.instanceof(Segment);
    // segments are perpendicular
    expect(perpendicular(seg, perp)).to.be.equal(true);
    // start is on segment
    expect(seg.distanceTo(perp.start)[0]).to.be.eql(0);
  });

});
