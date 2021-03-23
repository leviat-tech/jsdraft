/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const { parse } = require('../../src/loaders/javascript.js');


const simple = `
function identity(sketch) {
  return sketch
}
`;

const detailed = `
{
  name: 'echo',
  parameters: [{type: 'string', cast: 'number', default: '123'}],
  func: function blah(sketch, message) {
    return message
  }
}
`;

describe('parse', () => {

  it('can parse simple feature spec', () => {
    const f = parse(simple);
    expect(f).to.be.a('function');
    expect(f.identifier).to.be.eql('identity');
    expect(f(1)).to.eql(1);
  });

  it('can parse detailed feature spec', () => {
    const f = parse(detailed);
    expect(f).to.be.a('function');
    expect(f.identifier).to.be.eql('echo');
    expect(f({}, '1')).to.eql(1);
    expect(f({}, undefined)).to.eql(123);
  });

});
