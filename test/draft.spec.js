/* global describe, it */

const chai = require('chai');
const Draft = require('../src/draft.js');


chai.expect();

const { expect } = chai;

describe('Draft', () => {
  it('should be able to parse and render a javascript sketch', () => {
    const draft = new Draft();
    draft.add_sketch('my_point', 'js', `
      function feature(sketch, a, b) {
        return sketch.point(a, b);
      }
    `);
    const result = draft.render('my_point', [3, 5], 'svg');
    expect(result).to.contain('path');
  });

  it('should be able to parse and render a yaml sketch', () => {
    const draft = new Draft();
    draft.add_sketch('my_point', 'yaml', `
      parameters:
        - $x: 5
      reference:
        - $y: '10'
      sketch:
        - point: [$x, $y]
    `);
    const result = draft.render('my_point', [3, 5], 'svg');
    expect(result).to.contain('path');
  });

  it('should be able to register a user function', () => {
    const draft = new Draft();
    draft.add_sketch('my_point', 'yaml', `
      register: true
      parameters:
        - $x: 5
        - $y: 5
      reference:
        - $x2: $x * 2
        - $y2: $y * 2
      sketch:
        - point: [$x, $y]
        - point: [$x2, $y2]
        - point: [40, 40]
    `);

    expect(draft.sketch.my_point(1, 2).shape).to.eql({ x: 1, y: 2 });

    draft.add_sketch('instances', 'yaml', `
      register: true
      parameters:
      sketch:
        - my_point: [1, 1]
        - my_point: [10, 10]
        - my_point: [20, 20]
    `);

    const result = draft.render('instances', [], 'svg', { viewport: null });
    expect(result).to.contain('path');
  });

  it('should be able to parse and render the default javascript sketch', () => {
    const draft = new Draft();
    draft.add_sketch('feature', 'js', `
    function untitled (sketch, args) {
      return sketch;
    }
    `);
    const result = draft.render('feature', [], 'svg');
    expect(result).to.contain('svg');
  });
});
