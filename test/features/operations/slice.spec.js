/* global describe, it */

const { expect, use } = require('chai');
use(require('../../helpers.js'));
const Sketch = require('../../../src/sketch/sketch.js');


describe.only('Slice', () => {
  const foo = new Sketch()
    .polyface([0, 0], [16, 2], [25, 25], [2, 10]);

  it('should slice a polyface with a line', () => {
    const slice = foo.slice([[-20, 4], [30, 7]]);
    expect(slice.entities.length).to.eql(1);
    const segment = slice.entities[0];
    const ps = segment.ps;
    const pe = segment.pe;
    expect(ps).to.be.a.point({ x: 1.0526, y: 5.2632 });
    expect(pe).to.be.a.point({ x: 17.667, y: 6.26 });
  });
});
