const math = require('mathjs')
const flatten = require('@flatten-js/core');


class Segment extends flatten.Segment {
  constructor(...args) {

    // construct from four numbers (x1, y1, x2, y2)
    if (!(args[0] instanceof flatten.Point)) {
      return super(flatten.point(args[0], args[1]), flatten.point(args[2], args[3]));
    }

    // construct from 2 points
    return super(...args)
  }
}


module.exports = Segment;
