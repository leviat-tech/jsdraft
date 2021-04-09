/* global describe, it */

const { expect, use } = require('chai');
use(require('../helpers.js'));
const { parse } = require('../../src/loaders/yaml.js');
const Sketch = require('../../src/sketch/sketch.js');
const Circle = require('../../src/entities/geometric/circle.js');


describe('YAML', () => {
  const yaml = `
parameters:
  - $a: 1
  - $b: "str"
  - $c:point: [1, 5]
reference:
  - $num: 1
  - $str: '$a + 3'
  - $bool: true
  - $arr: [2, false, "3 + 5"]
  - $obj:
      foo: 6
      bar: 10
      baz: '"red"'
  - $my_point:sketch:
      - point: [2, 4]
  - $my_pline:sketch:
      - segment: [[0, 0], [5, -5]]
      - segment: [[5, -5], [0, -10]]
      - join
  - $circ:circle: [[5, 5], 20]
sketch:
  - point: [$num, $str]
  - point: ["$arr[0]", "$arr[2]"]
  - segment: [$my_point.shape, [$obj.foo, $obj.bar]]
  - add: $my_point
  - add: $my_pline
  - circle: [$c, 30]
  - point: [$circ.pc.x, $circ.pc.y]
  `;

  const func = parse(yaml, 'test');
  const sketch = func(new Sketch());
  const entities = [...sketch.shapes()];

  it('can parse a string reference', () => {
    expect(entities[0]).to.eql({ x: 1, y: 4 });
  });

  it('can parse an array reference', () => {
    expect(entities[1]).to.eql({ x: 2, y: 8 });
  });

  it('can parse a sketch reference', () => {
    expect(entities[2].ps).to.eql({ x: 2, y: 4 });
  });

  it('can parse a single non-array argument', () => {
    expect(entities[3]).to.eql({ x: 2, y: 4 });
  });

  it('can parse a single string key if no arguments are necessary', () => {
    expect(entities[4].vertices).to.eql([
      { x: 0, y: 0 }, { x: 5, y: -5 }, { x: 0, y: -10 },
    ]);
  });

  it('can cast a parameter to a type', () => {
    expect(entities[5]).to.be.instanceof(Circle);
  });

  it('can cast a reference to a type', () => {
    expect(entities[6]).to.be.a.point({ x: 5, y: 5 });
  });
});
