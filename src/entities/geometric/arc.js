const math = require('mathjs')
const flatten = require('@flatten-js/core');


class Arc extends flatten.Arc {
  constructor(...args) {

    // construct from four numbers (x, y, r, s, e, cc)
    if (!(args[0] instanceof flatten.Point)) {
      return super(flatten.point(args[0], args[1]), ...args.slice(2));
    }

    // construct from pt, r, start, end, cc
    return super(...args)
  }
}


module.exports = Arc;
