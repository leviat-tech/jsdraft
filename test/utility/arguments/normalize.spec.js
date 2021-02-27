/* global describe, it */
const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const normalize = require('../../../src/utility/arguments/normalize');
const Point = require('../../../src/entities/geometric/point');


describe('normalize', () => {

  it('will return primitives unchanged', () => {
    expect(normalize(1)).to.eql(1);
    expect(normalize('a')).to.eql('a');
  });

  it('will return nested arrays unchanged', () => {
    expect(normalize([])).to.eql([]);
    expect(normalize([[1], [[]]])).to.eql([[1], [[]]]);
  });

  it('will convert points to array representation', () => {
    expect(normalize(flatten.point(1, 2))).to.eql([1, 2]);
    expect(normalize(new Point(1, 2))).to.eql([1, 2]);
  });

  it('will convert segment to array representation', () => {
    expect(normalize(flatten.segment(flatten.point(1, 2), flatten.point(3, 4))))
      .to.eql([[1, 2], [3, 4]]);
  });

  it('will convert arc to array representation', () => {
    const arc_a = flatten.arc(flatten.point(1, 2), 3, 4, 5);
    const ary = normalize(arc_a);
    const arc_b = flatten.arc(flatten.point(...ary[0]), ary[1], ary[2], ary[3], ary[4]);
    expect(normalize(arc_a)).to.eql([[1, 2], 3, 4, 5, true]);
    expect(arc_a).to.eql(arc_b);
  });

});
