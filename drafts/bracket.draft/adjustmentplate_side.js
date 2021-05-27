return {
  parameters: [
    {
      name: "params",
      default: {
        height: 70 * 0.001,
        depth: 40 * 0.001,
        width: 20 * 0.001,
        thickness: 5 * 0.001,
        overhang: { height: 5 * 0.001, depth: 3 * 0.001 },
        hole: {
          x: 10 * 0.001,
          y: 10 * 0.001,
          d: 5 * 0.001,
        },
        cutout: { height: 5 * 0.001, depth: 3 * 0.001 },
        teeth: {
          height: 5 * 0.001,
          depth: 5 * 0.001,
          positions: [0 * 0.001, 10 * 0.001, 20 * 0.001],
        },
      },
    },
  ],
  func: function (sketch, params) {
    const back = sketch
      .polycurve(
        [0, 0],
        [0, -params.teeth.depth],
        [params.teeth.height, -params.teeth.depth],
        [params.teeth.height, 0]
      )
      .interpolate(
        [0, 0],
        [0, -params.height + params.overhang.height],
        params.teeth.positions
      )
      .translate(0, params.height - params.overhang.height);

    const plate = sketch.polyface(
      [0, 0],
      [-params.depth, 0],
      [-params.depth, params.height - params.cutout.height],
      [
        -params.depth + params.cutout.depth,
        params.height - params.cutout.height,
      ],
      [-params.depth + params.cutout.depth, params.height],
      [params.overhang.depth, params.height],
      [
        params.overhang.depth,
        params.height - params.overhang.height,
      ],
      ...back.vertices
    );

    const hole = sketch.circle(
      [
        -params.depth + params.hole.x,
        params.height - params.hole.y,
      ],
      params.hole.d / 2
    );

    const ref = sketch
      .polycurve([0, 0], [-params.depth, 0])
      .name("ref")
      .hide();

    return sketch.add(plate.subtract(hole), ref);
  },
};
