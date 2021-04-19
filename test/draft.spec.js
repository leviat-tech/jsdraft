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

  it('should render a feature', () => {
    const draft = new Draft();
    draft.add_feature('simple', 'js', simple);
    expect(draft).to.render({ name: 'point', x: 0, y: 0 }, { sketch: 'simple' });
  });

  it('should inject all files as user features when rendering', () => {
    const draft = new Draft();
    draft.add_feature('simple', 'js', simple);
    draft.add_feature('composed', 'js', composed);
    expect(draft).to.render({ name: 'point', x: 0, y: 0 }, { sketch: 'composed' });
  });

  it('should be able to parse and render a javascript sketch', () => {
    const draft = new Draft();
    draft.add_feature('my_point', 'js', `
      function feature(sketch, a, b) {
        return sketch.point(a, b);
      }
    `);
    const result = draft.render('my_point', [3, 5], 'svg');
    expect(result).to.contain('path');
  });

  it('should be able to parse and render a yaml sketch', () => {
    const draft = new Draft();
    draft.add_feature('my_point', 'yaml', `
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

  it('should be able to parse and render the default javascript sketch', () => {
    const draft = new Draft();
    draft.add_feature('feature', 'js', `
    function untitled (sketch, args) {
      return sketch;
    }
    `);
    const result = draft.render('feature', [], 'svg');
    expect(result).to.contain('svg');
  });

  it('can share the parameters of a file', () => {
    const draft = new Draft();

    draft.add_feature('my_yaml', 'yaml', `
      parameters:
        - $x: 5
      sketch:
        - point: [$x, 10]
    `);

    draft.add_feature('my_js', 'js', `
    {
      name: 'my_js',
      parameters: [
        { name: '$x', default: 5 },
      ],
      func: function my_js(sketch, x) {
        return sketch
          .point(x, 10);
      },
    }
    `);

    const params_1 = draft.features.sketch.my_yaml.parameters;
    const params_2 = draft.features.sketch.my_js.parameters;
    expect(params_1[0]).to.eql({ name: '$x', default: 5 });
    expect(params_2[0]).to.eql({ name: '$x', default: 5 });
  });

  it('should be able to load a file from disk', () => {
    const draft = Draft.load('./test/test-draft-files/test.draft');

    const result = draft.render('circle', [], 'svg');
    expect(result).to.contain('path');
  });
});
