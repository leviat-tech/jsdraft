return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        depth: 100,
        width: 200,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    const rect = sketch
      .rectangle(
        -params.width / 2,
        0,
        params.width / 2,
        params.height
      )
      .stroke("transparent");

    const bottom = rect.edges[0];

    const visLines = [
      0,
      params.thickness,
      params.height,
    ].map((ht) => {
      return bottom.translate(0, ht);
    });

    const middle = sketch
      .polycurve([0, -10], [0, params.height + 10])
      .linestyle(15, 2, 2, 5);

    const dottedLines = [-1, 1].map((dir) => {
      return middle.translate((dir * params.width) / 2, 0);
    });

    return sketch.add(rect, ...visLines, ...dottedLines);
  },
};
