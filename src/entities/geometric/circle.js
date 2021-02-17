const math = require('mathjs')
const flatten = require('@flatten-js/core');


class Circle extends flatten.Circle {
  constructor(...args) {
    // construct from 3 numbers (x, y, r)
    if (!(args[0] instanceof flatten.Point)) {
      return super(flatten.point(args[0], args[1]), args[2]);
    }
    // construct from point and radius
    return super(...args)
  }
}


module.exports = Circle;
