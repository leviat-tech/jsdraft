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

  it('will convert points to arrays', () => {
    expect(normalize(flatten.point(1, 2))).to.eql([1, 2]);
    expect(normalize(new Point(1, 2))).to.eql([1, 2]);
  });

  it('will convert points to arrays', () => {
    expect(normalize(flatten.point(1, 2))).to.eql([1, 2]);
    expect(normalize(new Point(1, 2))).to.eql([1, 2]);
  });

  it('will convert nested shapes', () => {
    expect(normalize([[flatten.point(1, 2)], 3])).to.eql([[[1, 2]], 3]);
  });

});
