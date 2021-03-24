/* global describe, it */
/* eslint-disable no-unused-expressions */
const { expect, use } = require('chai');
const Draft = require('../src/draft.js');
use(require('./helpers'));


const simple = `
function simple(sketch) {
  return sketch.point(0, 0);
}
`;

const composed = `
function composed(sketch) {
  return sketch.user.simple();
}
`;


describe('draft', () => {


  it('should inject all files as user features when rendering', () => {
    const draft = new Draft();
    draft.add_sketch('simple', 'js', simple);
    draft.add_sketch('composed', 'js', composed);
    expect(draft).to.render({ name: 'point', x: 0, y: 0 }, { sketch: 'composed' });
  });
});
