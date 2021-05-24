return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        width: 100,
        length: 400,
        trim_length: 200,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    let lineHts = [params.thickness];
    let stroke = "black";
    let dottedLines = [];
    let length = params.length;
    if (params.trim_length) {
      lineHts.push(0);
      lineHts.push(params.height);
      stroke = "transparent";
      length = params.trim_length;
    }
    const rect = sketch
      .rectangle(-length / 2, 0, length / 2, params.height)
      .stroke(stroke);

    const bottom = rect.edges[0];

    const visLines = lineHts.map((ht) => {
      return bottom.translate(0, ht);
    });

    if (params.trim_length) {
      const middle = sketch
        .polycurve([0, -10], [0, params.height + 10])
        .linestyle(15, 2, 2, 5);

      dottedLines = [-1, 1].map((dir) => {
        return middle.translate((dir * length) / 2, 0);
      });
    }

    return sketch.add(rect, ...visLines, ...dottedLines);
  },
};
