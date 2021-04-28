/* eslint-disable */
module.exports = function bbox(sketch) {
  const boxes = sketch.entities.map(e => e.box);
  const xmin = Math.min(...boxes.map(b => b.xmin));
  const xmax = Math.max(...boxes.map(b => b.xmax));
  const ymin = Math.min(...boxes.map(b => b.ymin));
  const ymax = Math.max(...boxes.map(b => b.ymax));
  return sketch.rectangle(xmin, ymin, xmax, ymax)
}
