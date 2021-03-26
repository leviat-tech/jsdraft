const flatten = require('@flatten-js/core');
const Point = require('../geometric/point');
const { normalize } = require('../../utility/arguments');


class Text {
  constructor(...args) {
    args = normalize(args);

    /*
      Args consist of a text string, a point, and a rotation property
      ["text", [0, 0], Math.PI / 4]
    */

    this.text = args[0];
    this.p = args[1] ? new Point(...args[1]) : new Point(0, 0);
    this.rotation = args[2] || 0;
  }

  transform(matrix = new flatten.Matrix()) {
    return new Text(this.text, this.p.transform(matrix), this.rotation);
  }
}

module.exports = Text;
