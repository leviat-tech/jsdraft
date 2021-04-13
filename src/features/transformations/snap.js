const flatten = require('@flatten-js/core');


function distance(a, b) {
  return a.distanceTo(b)[0];
}

function translation(a, b) {
  const c = a.distanceTo(b)[1];
  const t = flatten.vector(c.end, c.start);
  return flatten.matrix().translate(t.x, t.y);
}

// anchor is the element we are snapping to
// free is the element that will move and snap to the anchor
// anchor and free can be points, segments, or entitys
// snap will snap the free element to the anchor at their closest points
// if anchor and free are both edges/segments snap will:
//  1) snap them together at their start point
//  2) rotate them into alignment
//  3) offset along the anchor edge by the amount specified in the slide parameter
module.exports = function snap(sketch, anchor, free, slide, flip) {

  // for segments snap them together then align, for points or entities only snap them together
  if (anchor instanceof flatten.Segment && free instanceof flatten.Segment) {
    const as = anchor.start;
    const ae = anchor.end;
    const fs = free.start;
    const fe = free.end;

    // compute transformation to move snapped points together
    const translate = translation(as, fs);

    // compute the rotation matrix to align edges
    const va = flatten.vector(as, ae);
    const vf = flatten.vector(fs, fe);
    const angle = vf.angleTo(va);
    const rotate = flatten.matrix()
      .translate(fs.x, fs.y)
      .rotate(angle, 'rad')
      .translate(-fs.x, -fs.y);

    // compute the slide offset
    let offset = flatten.matrix();
    if (slide) {
      const s = anchor.tangentInStart().multiply(slide);
      offset = offset.translate(s.x, s.y);
    }

    // compute flip if specified by moving into world frame, aligning with x axis, flipping, then back to obj frame
    let reflect = flatten.matrix();
    if (flip) {
      const theta = free.tangentInStart().angleTo(flatten.vector(1, 0));
      reflect = flatten.matrix()
        .translate(fs.x, fs.y)
        .rotate(-theta)
        .scale(1, -1)
        .rotate(theta)
        .translate(-fs.x, -fs.y);
    }

    // rotate around snapping point and then translate to snap
    return sketch
      .transform(reflect)
      .transform(rotate)
      .transform(translate)
      .transform(offset);
  }
  return sketch.transform(translation(anchor, free));
};
