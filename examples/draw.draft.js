module.exports = function draw(sketch) {
  return sketch.draw(
    sketch.point(20, 20),
    sketch.segment([1, 1], [50, 50]),
    sketch.segment(sketch.point(20, 20).shape, sketch.point(30, 50).shape),
    // sketch.arc([50, 25], 15, 0, 3.14 / 2),
    // sketch.circle(75, 75, 10),
    // sketch.circle(50, 50, 50, 100),
    // sketch.rectangle(0, 0, 30, 20).translate(100, 30),
    // sketch.rectangle(
    //   [0, 0],
    //   [20, 20],
    // ).translate(150, 100),
    // sketch.polycurve(
    //   [60, 30, 60, 100],
    //   [60, 100, 100, 30],
    //   [100, 30, 15, 0, 3.14 / 2],
    // ),
    // sketch.polycurve(
    //   [0, 0],
    //   [0, 10, 1],
    //   [10, 0],
    //   [10, 10],
    //   { bulges: true },
    // ).translate(100, 50),
    // sketch.polycurve(
    //   [[0, 0], 1],
    //   [[0, 10], 0.5],
    //   [[10, 0], 1],
    //   [[10, 10]],
    // ).translate(100, 50),
    // sketch.polyface([
    //   [100, 100],
    //   [100, 150],
    //   [150, 100],
    // ]),
  ).fill('blue').stroke(2, 'red');
};


// const a = sketch.group(
//   sketch.point(20, 20),
//   sketch.segment(1, 1, 50, 50),
//   sketch.circle(75, 75, 10),
//   sketch.arc(50, 25, 15, 0, 3.14 / 2),
// )
//   .stroke(2, 'red')
//   .fill('blue');
//
// const b = sketch.group(
//   sketch.circle(25, 50, 10).stroke(3, 'green'),
//   sketch.polycurve(
//     [60, 30, 60, 100],
//     [60, 100, 100, 30],
//     [100, 30, 15, 0, 3.14 / 2],
//   ).stroke(2, 'pink'),
// );
//
// const c = sketch.group(
//   sketch.polyface([
//     [100, 100],
//     [100, 150],
//     [150, 100],
//   ]).stroke(2, 'orange'),
// );
//
// const p1 = sketch.polyface([
//   [100, 100],
//   [100, 150],
//   [150, 100],
// ]).fill('black');
//
// const p2 = sketch.polyface([
//   [110, 110],
//   [105, 120],
//   [130, 110],
// ]).fill('yellow');
//
// const sub = sketch.subtract(p1.shape, p2.shape).fill('green');
//
// const d = sketch.circle(75, 20, 10).fill('cyan');
//
// const t_d = d.translate(10, 10).fill('red');
//
// const e = sketch.polyface([
//   [110, 110],
//   [105, 120],
//   [130, 110],
// ]).fill('purple');
//
// const e_r = e.scale(0.5).rotate(20).fill('blue');
//
// return sketch.draw(
//   a,
//   b,
//   c,
//   p1,
//   p2,
//   sub.translate(10, 0),
//   d,
//   t_d,
//   sketch.polyface([
//     [0, 0],
//     [0, 10],
//     [10, 10],
//     [10, 0],
//   ])
//     .rotate(45)
//     .translate(45, 45)
//     .fill('red'),
//   sketch.polyface([
//     [0, 0],
//     [0, 10],
//     [10, 10],
//     [10, 0],
//   ])
//     .rotate(45)
//     .fill('red'),
//   // e,
//   // e_r
// );
