/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
use(require('../../helpers.js'));
const flatten = require('@flatten-js/core');
const Sketch = require('../../../src/sketch/sketch.js');
const Point = require('../../../src/entities/geometric/point.js');
const validate = require('../../../src/utility/validation/validate.js');
const entities = require('../../../src/entities');


function expect_type_passes(type, value) {
  expect(validate([{ type }], [value])).to.eql([value]);
}

function expect_type_failure(type, value) {
  expect(() => validate([{ type }], [value])).to.throw(TypeError);
}

describe('validate', () => {

  // Reconsider this validation: i.e., if defaults are supplied, then the function
  // could be called with no arguments.
  // it('raises error when number of arguments does not match parameter definition', () => {
  //   expect(() => validate([], [1])).to.throw(RangeError);
  //   expect(() => validate([{}], [])).to.throw(RangeError);
  //   expect(() => validate([{}, {}], [])).to.throw(RangeError);
  //   expect(() => validate([{}, {}], [1, 1, 1])).to.throw(RangeError);
  // });

  it('to be set default when argument is null or undefined', () => {
    expect(validate([{}], [1])).to.eql([1]);
    expect(validate([{ default: 2 }], [1])).to.eql([1]);
    expect(validate([{ default: 2 }], [null])).to.eql([2]);
    expect(validate([{ default: 2 }], [undefined])).to.eql([2]);
  });

  it('to be able to validate string type', () => {
    expect_type_passes('string', '');
    expect_type_failure('number', 'hello');
    expect_type_passes('string', 'hello');
  });

  it('to be able to validate boolean type', () => {
    expect_type_passes('boolean', true);
    expect_type_passes('boolean', false);
    expect_type_failure('number', true);
  });

  it('to be able to validate number type', () => {
    expect_type_passes('number', 0);
    expect_type_passes('number', 1);
    expect_type_passes('number', 1 / 0); // should we ensure isFinite?
    expect_type_failure('string', 1);
  });

  // arc, circle, point, polycurve, polyface, rectangle, segment
  it('to be able to validate an entity type', () => {
    expect_type_passes('point', entities.point());
    expect_type_failure('point', flatten.point());
    expect_type_failure('string', flatten.point());
    expect_type_failure('circle', flatten.point());
  });

  it('to be able to cast a primitive type', () => {
    expect(validate([{ cast: 'string' }], [1])).to.eql(['1']);
  });

  it('to be able to cast an entity type', () => {
    expect(validate([{ cast: 'point' }], [[0, 1]])).to.eql([{
      x: 0,
      y: 1,
    }]);

    expect(validate([{ cast: 'circle' }], [[[0, 10], 20]])[0].pc)
      .to.be.a.point({ x: 0, y: 10 });
  });

  it('to be able to validate a sketch', () => {
    const sketch = new Sketch();
    const pt_sketch = sketch.point(1, 1);

    expect(validate(
      [{ cast: 'sketch' }],
      [pt_sketch],
      sketch,
    )[0]).to.be.instanceof(Sketch);

    expect(() => validate(
      [{ cast: 'sketch' }],
      [{}],
      sketch,
    )).to.throw(TypeError);
  });

  it('to be able to cast an entity to a sketch', () => {
    const sketch = new Sketch().point(0, 5);
    const pt = new Point(2, 4);
    const validated = validate(
      [{ cast: 'sketch' }],
      [pt],
      sketch,
    )[0];

    expect(validated).to.be.instanceof(Sketch);
    expect(validated.shape).to.be.a.point({ x: 2, y: 4 });
  });
});
