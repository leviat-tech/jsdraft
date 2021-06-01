/* global describe, it */

const { expect, use } = require('chai');
use(require('../helpers.js'));
const Sketch = require('../../src/sketch/sketch.js');
const render = require('../../src/render.js');


describe('A sketch rendered to entities', () => {
  const sketch = new Sketch()
    .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
    .aligned_dim([-12, 2], [0, 0])
    .polycurve([0, 0], [-10, -10], -1, [-20, 0])
    .rectangle([5, -10], 5, 3)
    .circle([5, -10], 5)
    .arc([10, 0], 0.5, [15, 5])
    .segment([0, 0], [1, -10])
    .point(3, 2)
    .dim_string([0, 0], [25, 25], [5, 10, 15]);


  it('can render a list of entities', () => {
    const entities = render(sketch, 'entities');
    expect(entities.length).to.eql(9);
    expect(entities[0]).to.be.a.polyface(4);
    expect(entities[1]).to.be.an.aligned_dim({ x: -12, y: 2 }, { x: 0, y: 0 });
  });

  it('can render a serialized list of entities', () => {
    const entities = render(sketch, 'entities', { serialize: true });
    expect(entities.length).to.eql(9);
    expect(entities[0].entity_type).to.eql('polyface');
    expect(entities[1].entity_type).to.eql('aligned_dim');
    expect(entities[3].properties.faces.length).to.eql(1);
    expect(entities[3].properties.faces[0].edges.length).to.eql(4);
  });
});
