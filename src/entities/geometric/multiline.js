const math = require('mathjs')
const flatten = require('@flatten-js/core');


class Multiline extends flatten.Multiline {
  constructor(...args) {
    if (Array.isArray(args[0]) && typeof args[0][0] == 'number') {
      return super(args.map(a => {
        // array numbers treated as segments
        if (a.length == 4) {
          return flatten.segment(...a)
        }
        // array of numbers treated as arcs
        else {
          return flatten.arc(flatten.point(a[0], a[1]), ...a.slice(2))
        }
      }));

    }
    // construct from 2 points
    return super(...args)
  }
}


module.exports = Multiline;
