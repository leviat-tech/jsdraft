const { expect } = require('chai');
const flatten = require('@flatten-js/core');
const Polyface = require('../src/entities/geometric/polyface.js');
const Polycurve = require('../src/entities/geometric/polycurve.js');
const Arc = require('../src/entities/geometric/arc.js');
const Circle = require('../src/entities/geometric/circle.js');
const Rectangle = require('../src/entities/geometric/rectangle.js');
const AlignedDim = require('../src/entities/annotation/aligned-dim.js');


module.exports = function helpers(chai) {
  const Assertion = chai.Assertion;

  Assertion.addMethod('entity', function entity(e) {
    expect(Array.from(this._obj.shapes())).to.deep.include(e);
  });

  Assertion.addMethod('render', function render(entity, options) {
    const entities = this._obj.render(options.sketch, options.args || [], 'json', { nodes: false });
    expect(JSON.parse(entities)).to.deep.include(entity);
  });

  Assertion.addMethod('point', function point(entity) {
    let x = parseFloat(this._obj.x.toFixed(4), 10);
    let y = parseFloat(this._obj.y.toFixed(4), 10);

    if (x === 0) x = 0; // handle case where x === -0
    if (y === 0) y = 0;

    expect(this._obj).to.be.instanceof(flatten.Point);
    expect({ x, y }).to.eql(entity);
  });

  Assertion.addMethod('polyface', function polyface(vertices) {
    new Assertion(this._obj).to.be.instanceof(Polyface);
    if (typeof (vertices) === 'number') {
      new Assertion(this._obj.vertices.length).to.eql(vertices);
    } else {
      expect(this._obj.vertices).to.eql(vertices.map((v) => flatten.point(...v)));
    }
  });

  Assertion.addMethod('polycurve', function polycurve(vertices) {
    new Assertion(this._obj).to.be.instanceof(Polycurve);
    new Assertion(this._obj.vertices.length).to.eql(vertices);
  });

  Assertion.addMethod('arc', function arc(radius) {
    new Assertion(this._obj).to.be.instanceof(Arc);
    new Assertion(this._obj.r).to.be.closeTo(radius, 0.000001);
  });

  Assertion.addMethod('circle', function circle(radius) {
    new Assertion(this._obj).to.be.instanceof(Circle);
    new Assertion(this._obj.area()).to.be.closeTo(radius ** 2 * Math.PI, 0.000001);
  });

  Assertion.addMethod('rectangle', function rect(xmin, ymin, xmax, ymax) {
    new Assertion(this._obj).to.be.instanceof(Rectangle);
    new Assertion(this._obj.xmin).to.be.closeTo(xmin, 0.00001);
    new Assertion(this._obj.ymin).to.be.closeTo(ymin, 0.00001);
    new Assertion(this._obj.xmax).to.be.closeTo(xmax, 0.00001);
    new Assertion(this._obj.ymax).to.be.closeTo(ymax, 0.00001);
  });

  Assertion.addMethod('aligned_dim', function aligned_dim(ps, pe) {
    new Assertion(this._obj).to.be.instanceof(AlignedDim);
    if (ps) {
      new Assertion(this._obj.ps).to.be.a.point(ps);
    }

    if (pe) {
      new Assertion(this._obj.pe).to.be.a.point(pe);
    }
  });
};
