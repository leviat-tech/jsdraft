const math = require('mathjs');
const flatten = require('@flatten-js/core');


class Point extends flatten.Point {
  constructor(...args) {
    return flatten.point(...args);
  }
}


module.exports = Point;
