const { expect } = require('chai');
const flatten = require('@flatten-js/core');


module.exports = function helpers(chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('entity', function (entity) {
    expect(Array.from(this._obj.shapes())).to.deep.include(entity);
  });

  Assertion.addMethod('render', function (entity, options) {
    const entities = this._obj.render(options.sketch, options.args || [], 'json', { nodes: false });
    expect(JSON.parse(entities)).to.deep.include(entity);
  });

  Assertion.addMethod('point', function (entity) {
    let x = parseFloat(this._obj.x.toFixed(4), 10);
    let y = parseFloat(this._obj.y.toFixed(4), 10);

    if (x === 0) x = 0; // handle case where x === -0
    if (y === 0) y = 0;

    expect(this._obj).to.be.instanceof(flatten.Point);
    expect({ x, y }).to.eql(entity);
  });
};
