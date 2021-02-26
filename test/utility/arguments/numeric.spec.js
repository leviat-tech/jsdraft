/* global describe, it */

const { expect } = require('chai');
const { numeric_arrays, nested_numeric_arrays } = require('../../../src/utility/arguments/numeric');


describe('numeric_arrays', () => {
  it('will return false when an empty array is passed', () => {
    expect(numeric_arrays([[]], { eq: 1 })).to.be.false;
    expect(numeric_arrays([])).to.be.false;
  });

  it('will return true when a collection of numeric arrays is passed', () => {
    expect(numeric_arrays([
      [],
    ])).to.be.true;
    expect(numeric_arrays([
      [1, 2],
    ])).to.be.true;
    expect(numeric_arrays([
      [1],
      [1, 2, 3],
    ])).to.be.true;
  });

  it('will return false when a collection is not every of numeric arrays', () => {
    expect(numeric_arrays([
      'hi',
    ])).to.be.false;
    expect(numeric_arrays([
      [1, 'a'],
    ])).to.be.false;
  });

  it('will return false when arrays in collection do not match requested sizes', () => {
    expect(numeric_arrays([
      [1],
      [1, 2],
    ], {
      min: 1,
    })).to.be.true;
    expect(numeric_arrays([
      [1, 2],
      [1, 2],
    ], {
      eq: 2,
    })).to.be.true;
    expect(numeric_arrays([
      1,
      [1, 2],
    ], {
      eq: 2,
    })).to.be.false;
    expect(numeric_arrays([
      [],
      [1],
    ], {
      min: 1,
    })).to.be.false;
    expect(numeric_arrays([
      [],
      [1],
    ], {
      max: 1,
    })).to.be.true;
    expect(numeric_arrays([
      [],
      [1, 2],
    ], {
      max: 1,
    })).to.be.false;
    expect(numeric_arrays([
      [],
    ], {
      eq: 1,
    })).to.be.false;
    expect(numeric_arrays([
      [1, 2],
    ], {
      eq: 1,
    })).to.be.false;
    expect(numeric_arrays([
      [1],
    ], {
      eq: 1,
    })).to.be.true;
  });
});

describe('nested_numeric_arrays', () => {
  it('will return false when a collection with a non-nested array is passed', () => {
    expect(nested_numeric_arrays([
      [],
      [1, []],
    ])).to.be.false;
    expect(nested_numeric_arrays([
      [[]],
      [1, []],
    ])).to.be.true;
    expect(nested_numeric_arrays([
      [['a']],
    ])).to.be.false;
    expect(nested_numeric_arrays([
      [[1]],
    ])).to.be.true;
    expect(nested_numeric_arrays([
      [[1]],
    ], {
      eq: 2,
    })).to.be.false;
  });
});
