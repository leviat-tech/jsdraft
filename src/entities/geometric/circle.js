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

  transform(matrix = new Flatten.Matrix()) {
    // breaks x, y scaling would need be paramaterized with 2 vectors and center
    // arcs are also only defined on a circle and break under some affine transforms
    // at the very least we need to validate the transformation matrix
    // and we should add that to arcs as well
    const p = flatten.point(this.pc.x, this.pc.y + this.r);
    const t_p = p.transform(matrix);
    const t_pc = this.pc.transform(matrix);
    const t_r = t_pc.distanceTo(t_p)[0];
    return new Circle(t_pc, t_r);
  }
}


module.exports = Circle;
