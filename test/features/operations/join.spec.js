/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');
const { base_entity_type } = require('../../../src/utility/misc/entity-type.js');


chai.expect();

const { expect } = chai;

describe('Join', () => {
  const sketch = new Sketch()
    .segment([0, 0], [10, 10])
    .segment([50, 50], [40, 40])
    .segment([10, 10], [20, 0])
    .polycurve(
      [-20, -20],
      [-10, 0],
      [0, 0],
    )
    .segment([-20, -20], [20, 0]);

  it('can join a collection of segments', () => {
    const result = sketch.join();
    const e = Array.from(result.shapes());
    expect(e.length).to.eql(2);
    expect(base_entity_type(e[0])).to.eql('polyface');
    expect(e[0].vertices).to.eql([
      { x: -20, y: -20 },
      { x: -10, y: 0 },
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 20, y: 0 },
    ]);
    expect(base_entity_type(e[1])).to.eql('segment');
  });
});
