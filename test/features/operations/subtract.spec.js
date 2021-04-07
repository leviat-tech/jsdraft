/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe('Subtract', () => {
  const a = new Sketch()
    .rectangle([0, 0], 10, 5);

  const b = new Sketch()
    .rectangle([8, 2], 5, 3)
    .shape;

  it('Should allow a polyface to be subtracted from another polyface', () => {
    const result = a.subtract(b);
    const v = result.shape.vertices;

    expect(v[0]).to.be.a.point({ x: 0, y: 0 });
    expect(v[1]).to.be.a.point({ x: 0, y: 5 });
    expect(v[2]).to.be.a.point({ x: 10, y: 0 });
    expect(v[3]).to.be.a.point({ x: 8, y: 5 });
    expect(v[4]).to.be.a.point({ x: 8, y: 2 });
    expect(v[5]).to.be.a.point({ x: 10, y: 2 });
  });
});
