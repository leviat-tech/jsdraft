/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const is_segment = require('../../../src/utility/geometry/is-segment.js');


// `is_segment` normalizes a flatten-js edge's `isSegment` to a boolean regardless of
// whether it is exposed as a method (older flatten-js) or a getter / boolean property
// (newer flatten-js). These tests exercise both forms for true and false.
describe('is_segment', () => {

  // Expected Behavior 2.1: method form returns the underlying boolean.
  it('returns true when isSegment is a method returning true', () => {
    const edge = { isSegment() { return true; } };
    expect(is_segment(edge)).to.equal(true);
  });

  it('returns false when isSegment is a method returning false', () => {
    const edge = { isSegment() { return false; } };
    expect(is_segment(edge)).to.equal(false);
  });

  // Bug Condition / Expected Behavior 2.2: getter form returns the underlying boolean
  // without throwing (the unguarded method call would throw a TypeError here).
  it('returns true when isSegment is a getter returning true, without throwing', () => {
    const edge = {};
    Object.defineProperty(edge, 'isSegment', {
      get() { return true; },
      enumerable: true,
      configurable: true,
    });
    expect(() => is_segment(edge)).to.not.throw();
    expect(is_segment(edge)).to.equal(true);
  });

  it('returns false when isSegment is a getter returning false, without throwing', () => {
    const edge = {};
    Object.defineProperty(edge, 'isSegment', {
      get() { return false; },
      enumerable: true,
      configurable: true,
    });
    expect(() => is_segment(edge)).to.not.throw();
    expect(is_segment(edge)).to.equal(false);
  });

});
