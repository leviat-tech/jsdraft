const { expect } = require('chai');


module.exports = function helpers(chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('entity', function (entity) {
    expect(Array.from(this._obj.entities())).to.deep.include(entity);
  });

  Assertion.addMethod('render', function (entity, options) {
    const entities = this._obj.render(options.sketch, options.args || [], 'json', { nodes: false });
    expect(JSON.parse(entities)).to.deep.include(entity);
  });
};
