/* global describe, it */

const { expect, use } = require('chai');
use(require('../helpers.js'));
const Sketch = require('../../src/sketch/sketch.js');
const render = require('../../src/render.js');


describe('A sketch rendered to entities', () => {
  const sketch = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .aligned_dim([-12, 2], [0, 0]);


  it('can render a list of entities', () => {
    const entities = render(sketch, 'entities');
    // console.log('entities', entities);
  });
});
