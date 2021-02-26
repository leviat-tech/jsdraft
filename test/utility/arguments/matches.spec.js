/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const { matches, every } = require('../../../src/utility/arguments/matches');
const Point = require('../../../src/entities/geometric/point');


// matches(args, 'point', 'number', 'number', 'number', '...');

const pa = flatten.point(1, 2);
const pb = flatten.point(3, 4);


describe('matches', () => {

  it('can test number', () => {
    expect(matches([1], 'number')).to.be.true;
    expect(matches([1], 'point')).to.be.false;
  });

  it('can test string', () => {
    expect(matches(['a'], 'string')).to.be.true;
    expect(matches([1], 'string')).to.be.false;
  });

  it('can test a point', () => {
    expect(matches([pa], 'point')).to.be.true;
    expect(matches([new Point([1, 2])], 'point')).to.be.true;
    expect(matches([[1, 2]], 'point')).to.be.true;
    expect(matches([[1]], 'number')).to.be.false;
    expect(matches([[1, 2, 3]], 'number')).to.be.false;
  });

  it('can test a segment', () => {
    expect(matches([flatten.segment(pa, pb)], 'segment')).to.be.true;
    expect(matches([[[1, 2], [3, 4]]], 'segment')).to.be.true;
    expect(matches([[1, 2, 3, 4]], 'number')).to.be.false;
  });

  it('can test an arc', () => {
    expect(matches([flatten.arc(flatten.point(1, 2), 0, 10)], 'arc')).to.be.true;
    expect(matches([[[1, 2], 3, 4, 5]], 'arc')).to.be.true;
    expect(matches([[[1, 2], 3, 4, 5, true]], 'arc')).to.be.true;
    expect(matches([[1, 2, 3, 4, 5]], 'number')).to.be.false;
  });

  it('can test multiple arguments', () => {
    expect(matches([1, 2, pa], 'number', 'number', 'point')).to.be.true;
  });

  it('tests every argument', () => {
    expect(matches([1, 2, pa], 'number', 'number')).to.be.false;
    expect(matches([1, 2], 'number', 'number', 'point')).to.be.true;
  });

  it('allows arbitrary arguments using ...', () => {
    expect(matches([1, 2, pa], 'number', '...')).to.be.true;
    expect(matches([1, 2], 'number', 'number', '...')).to.be.true;
    expect(matches([1], 'number', '...')).to.be.true;
    expect(matches([pa], 'number', '...')).to.be.false;
  });

  it('allows types with or between them', () => {
    expect(matches([1], 'number or string')).to.be.true;
    expect(matches(['a'], 'number or string')).to.be.true;
    expect(matches([pa], 'number or string')).to.be.false;
  });

});


describe('every', () => {

  it('returns false if all elements are not arrays', () => {
    expect(every([1], [])).to.be.false;
    expect(every([[], 1], [])).to.be.false;
  });

  it('returns true if all elements match pattern', () => {
    expect(every([[1], [1]], ['number'])).to.be.true;
    expect(every([[1, 2], [1, 2]], ['number', 'number'])).to.be.true;
    expect(every([[1], [1, 2]], ['number', '...'])).to.be.true;
    expect(every([[1, 2], [1]], ['number'])).to.be.false;
    expect(every([[1], ['a']], ['number'])).to.be.false;
    expect(every([[1], ['a']], ['number or string'])).to.be.true;
  });
});
