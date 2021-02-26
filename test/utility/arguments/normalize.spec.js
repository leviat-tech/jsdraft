/* global describe, it */
const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const normalize = require('../../../src/utility/arguments/normalize');


const pa = flatten.point(1, 2);
const pb = flatten.point(3, 4);


describe('normalize', () => {

  it('will return primitives unchanged', () => {
    expect(normalize(1)).to.eql(1);
    expect(normalize('a')).to.eql('a');
  });

  it('will return nested arrays unchanged', () => {
    expect(normalize([])).to.eql([]);
    expect(normalize([[1], [[]]])).to.eql([[1], [[]]]);
  });

  it('will convert numeric 2-arrays to point', () => {
    expect(normalize([1, 2])).to.eql(flatten.point(1, 2));
  });

  it('will convert array to segment', () => {
    expect(normalize([[1, 2], [3, 4]])).to.eql(flatten.segment(pa, pb));
  });

  it('will convert array to arc', () => {
    expect(normalize([[1, 2], 3, 4])).to.eql(flatten.arc(pa, 3, 4));
    expect(normalize([[1, 2], 3, 4, true])).to.eql(flatten.arc(pa, 3, 4, true));
  });

});
