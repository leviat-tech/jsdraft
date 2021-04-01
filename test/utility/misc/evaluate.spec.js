/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const evaluate = require('../../../src/utility/misc/evaluate');


describe('evaluate', () => {

  it('can process primitives expressions', () => {
    expect(evaluate('1')).to.be.eql(1);
    expect(evaluate('1.0')).to.be.eql(1);
    expect(evaluate('"a"')).to.be.eql('a');
  });

  it('can process arrays expressions', () => {
    expect(evaluate('[1, 2]')).to.be.eql([1, 2]);
  });

  it('can process arrays expressions with trailing commas', () => {
    expect(evaluate('[1, 2,]')).to.be.eql([1, 2]);
  });

  it('can process new expressions', () => {
    expect(evaluate('new Array(1, 2)')).to.be.eql([1, 2]);
  });

  it('can process objects expressions', () => {
    expect(evaluate('{a: 1}')).to.be.eql({ a: 1 });
    expect(evaluate('{"a": 1}')).to.be.eql({ a: 1 });
  });

  it('can process a variable declaration expression', () => {
    expect(evaluate('a = 1')).to.be.eql(1);
  });

  it('can process a function declaration expression', () => {
    expect(evaluate('function() {return 1;}')).to.be.a('function');
  });

  it('can process a function declaration expression with arguments', () => {
    expect(evaluate('function(a, b) {return 1;}')).to.be.a('function');
  });

  it('can process a function declaration expression with multiple lines', () => {
    expect(evaluate(`function(a, b) {
      console.log('hello world')
      return 1;
    }`)).to.be.a('function');
  });

  it('can process a function call with trailing commas', () => {
    expect(evaluate('new Array(1, 2, )')).to.be.eql([1, 2]);
  });

  it('can process a function call of multiple lines', () => {
    expect(evaluate('new Array(1, 2, )')).to.be.eql([1, 2]);
  });

  it('will allow an explicit return statement', () => {
    expect(evaluate('return new Array(1, 2, )')).to.be.eql([1, 2]);
  });

  it('can not evaluate statements', () => {
    expect(() => evaluate('console.log(1);')).to.throw();
  });

  it('works in a strict context', () => {
    function test() {
      'use strict'; // eslint-disable-line
      return evaluate('a', { a: 1 });
    }
    expect(test()).to.be.eql(1);
  });

});
