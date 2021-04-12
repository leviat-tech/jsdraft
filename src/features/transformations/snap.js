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
// if anchor and free are both edges/segments snap will snap them together by the closest point
//    then then rotate the opposite points so the edges overlap
module.exports = function snap(sketch, anchor, free) {
  // for segments snap them together then align, for points or entities only snap them together
  if (anchor instanceof flatten.Segment && free instanceof flatten.Segment) {
    const as = anchor.start;
    const ae = anchor.end;
    const fs = free.start;
    const fe = free.end;

    // find the closest points between the two segments
    const pairs = [
      { snapped: [as, fs], gapped: [ae, fe], distance: distance(as, fs) },
      { snapped: [as, fe], gapped: [ae, fs], distance: distance(as, fe) },
      { snapped: [ae, fs], gapped: [as, fe], distance: distance(ae, fs) },
      { snapped: [ae, fe], gapped: [as, fs], distance: distance(ae, fe) }];
    pairs.sort((a, b) => a.distance - b.distance);
    const closest = pairs[0];

    // compute transformation to move snapped points together
    const t = translation(closest.snapped[0], closest.snapped[1]);

    // determine the angle between the points that won't be snapped together
    const va = flatten.vector(closest.snapped[0], closest.gapped[0]);
    const vf = flatten.vector(closest.snapped[1], closest.gapped[1]);
    const angle = vf.angleTo(va);

    // rotate around snapping point and then translate to snap
    const origin = closest.snapped[1];
    return sketch
      .translate(-origin.x, -origin.y)
      .rotate(angle, 'rad')
      .translate(origin.x, origin.y)
      .transform(t);
  }
  return sketch.transform(translation(anchor, free));
};
