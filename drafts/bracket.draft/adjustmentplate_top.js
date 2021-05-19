return {
  parameters: [
    {
      name: "params",
      default: {
        height: 70,
        depth: 40,
        width: 20,
        thickness: 5,
        overhang: { height: 5, depth: 3 },
        hole: { x: 10, y: 10, d: 5 },
        cutout: { height: 5, depth: 3 },
        teeth: {
          height: 5,
          depth: 5,
          positions: [0, 10, 20],
        },
      },
    },
  ],
  func: function (sketch, params) {
    const rect = sketch.rectangle(
      -params.width / 2,
      0,
      params.width / 2,
      -params.height
    );

    const line = sketch.polycurve(
      [params.width / 2 - params.thickness, 0],
      [params.width / 2 - params.thickness, -params.height]
    );

    const lines = [-1, 1].map((dir) => {
      return line.scale(dir, 1);
    });

    return sketch.add(rect, ...lines);
  },
};
