/* global describe, it */

const chai = require('chai');
const Sketch = require('../../../src/sketch/sketch.js');
const { base_entity_type } = require('../../../src/utility/misc/entity-type.js');


chai.expect();

const { expect } = chai;

describe('Add Face', () => {
  const sketch = new Sketch()
    .polyface(
      [-25, 0],
      [-25, 25],
      1,
      [25, 25],
      [25, 0],
    );

  const face = new Sketch()
    .circle([0, 15], 5);

  const result = sketch.add_face(face.shape);

  it('should add a face to a polyface', () => {
    const entities = [...result.shapes()];
    expect(entities.length).to.eql(1);
    expect(base_entity_type(entities[0])).to.eql('polyface');
    expect(entities[0].faces.size).to.eql(2);
  });
});
