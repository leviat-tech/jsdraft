return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        depth: 100,
        width: 200,
        trim_width: 200,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    let lineHts = [params.thickness];
    let stroke = "black";
    let dottedLines = [];
    if (params.trim_width) {
      lineHts.push(0);
      lineHts.push(params.height);
      stroke = "transparent";
    }
    const rect = sketch
      .rectangle(
        -params.width / 2,
        0,
        params.width / 2,
        params.height
      )
      .stroke(stroke);

    const bottom = rect.edges[0];

    const visLines = lineHts.map((ht) => {
      return bottom.translate(0, ht);
    });

    if (params.trim_width) {
      const middle = sketch
        .polycurve([0, -10], [0, params.height + 10])
        .linestyle(15, 2, 2, 5);

      dottedLines = [-1, 1].map((dir) => {
        return middle.translate(
          (dir * params.width) / 2,
          0
        );
      });
    }

    return sketch.add(rect, ...visLines, ...dottedLines);
  },
};
