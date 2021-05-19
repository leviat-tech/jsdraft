return {
  parameters: [
    {
      name: "params",
      default: {
        height: 70,
        depth: 40,
        width: 20,
        thickness: 5,
        overhang: { height: 5, width: 3 },
        hole: { x: 10, y: 10, d: 5 },
        cutout: { height: 5, width: 3 },
        teeth: {
          height: 5,
          depth: 5,
          positions: [0, 10, 20],
        },
      },
    },
  ],
  func: function (sketch, params) {
    const outer = sketch.polycurve(
      [params.width / 2, params.height],
      [params.width / 2, params.width / 2],
      -1,
      [-params.width / 2, params.width / 2],
      [-params.width / 2, params.height]
    );

    const inner = outer.offset(-params.thickness);

    const left = sketch.polycurve(
      outer.vertices[0],
      inner.vertices[0]
    );
    const right = sketch.polycurve(
      inner.vertices.slice(-1)[0],
      outer.vertices.slice(-1)[0]
    );
    const U = sketch.new
      .add(outer, inner, left, right)
      .join();

    const hole = sketch.arc(
      [
        -params.width / 2 + params.thickness,
        params.height - params.hole.y - params.hole.d,
      ],
      1,
      [
        -params.width / 2 + params.thickness,
        params.height - params.hole.y,
      ]
    );

    const holes = [1, -1].map((dir) => {
      return hole.scale(dir, 1);
    });

    return sketch.add(U, ...holes);
  },
};
