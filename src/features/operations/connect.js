const points_are_near = require('../../utility/geometry/points-are-near.js');
const Segment = require('../../entities/geometric/segment.js');
const Polycurve = require('../../entities/geometric/polycurve.js');


module.exports = function connect(sketch, ...sketches) {
  const pcurves = sketches.reduce((curves, s) => [
    ...curves,
    ...s.polycurves,
  ], sketch.polycurves);

  if (pcurves.length < 1) throw new Error('must supply a polycurve to connect');
  const p = pcurves[0];
  const curves = pcurves.slice(1);

  let segs = p.toShapes();

  curves.forEach((curve) => {
    const a = segs[segs.length - 1].end;
    const b = curve.first.start;
    if (points_are_near(a, b)) {
      segs = [...segs, ...curve.toShapes()];
    } else {
      segs = [...segs, new Segment(a, b), ...curve.toShapes()];
    }
  });

  const joined = new Polycurve(...segs);

  return sketch.new.add(joined);
};
