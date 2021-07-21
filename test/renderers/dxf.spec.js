/* global describe, it */

const { expect, use } = require('chai');
use(require('../helpers.js'));
const DxfParser = require('dxf-parser');
const Sketch = require('../../src/sketch/sketch.js');
const dxf = require('../../src/renderers/sketch/dxf.js');


const parser = new DxfParser();

describe('A sketch rendered to DXF', () => {
  const a = new Sketch()
    .point(1, 2)
    .segment([1, 1], [10, 10])
    .arc([0, 0], 3, 0, Math.PI / 2, true)
    .circle([0, 0], 20)
    .rectangle([0, 0], 20, 20)
    .polycurve(
      [[0, 0], [1, 1]],
      [[1, 1], [2, 0]],
      [[2, 0], [5, 5]],
    )
    .polyface(
      [0, 0],
      [3, 3],
      1,
      [5, 4],
      [8, 2],
    )
    .text(
      'Hello',
      [2, 3],
    );

  const b = new Sketch()
    .polyface([0, 0], [50, 0], 1, [50, 50], [0, 50])
    .subtract(new Sketch().circle([20, 20], 10));

  const a_rendered = dxf(a);
  const a_parsed = parser.parseSync(a_rendered);

  const b_rendered = dxf(b);
  const b_parsed = parser.parseSync(b_rendered);

  it('Will render points', () => {
    const point = a_parsed.entities[0];
    expect(point.type).to.eql('POINT');
    expect(point.position).to.eql({ x: 1, y: 2, z: 0 });
  });

  it('Will render segments', () => {
    const segment = a_parsed.entities[1];
    expect(segment.type).to.eql('LINE');
    expect(segment.vertices.length).to.eql(2);
  });

  it('Will render arcs', () => {
    const arc = a_parsed.entities[2];
    expect(arc.type).to.eql('ARC');
    expect(arc.radius).to.eql(3);
  });

  it('Will render circles', () => {
    const circle = a_parsed.entities[3];
    expect(circle.type).to.eql('POLYLINE');
    expect(circle.vertices.length).to.eql(2);
  });

  it('Will render polycurves', () => {
    const polycurve = a_parsed.entities[5];
    expect(polycurve.type).to.eql('POLYLINE');
    expect(polycurve.vertices.length).to.eql(4);
  });

  it('Will render compound polyfaces', () => {
    const entities = b_parsed.entities;
    expect(entities.length).to.eql(2);
    const curve_a = entities[0].vertices.map((v) => ({ x: v.x, y: v.y }));
    expect(curve_a).to.eql([
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
      { x: 0, y: 50 },
    ]);
  });
});
