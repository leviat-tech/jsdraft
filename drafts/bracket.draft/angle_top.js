return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        width: 50,
        length: 400,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    let lineHts = [-params.thickness];
    let stroke = "black";
    let dottedLines = [];
    let length = params.length;
    if (params.trim_length) {
      lineHts.push(0);
      lineHts.push(-params.width);
      stroke = "transparent";
      length = params.trim_length;
    }
    const rect = sketch
      .rectangle(-length / 2, 0, length / 2, -params.width)
      .stroke(stroke);

    const top = rect.edges[0];
    const rightRef = sketch.new
      .add(rect.edges[1].reverse())
      .name("right")
      .hide();
    const leftRef = sketch.new
      .add(rect.edges[3])
      .name("left")
      .hide();
    const topRef = sketch.new.add(top).name("top").hide();

    const visLines = lineHts.map((ht) => {
      return top.translate(0, ht);
    });

    if (params.trim_length) {
      const middle = sketch
        .polycurve([0, 10], [0, -params.width - 10])
        .linestyle(15, 2, 2, 5);

      dottedLines = [-1, 1].map((dir) => {
        return middle.translate((dir * length) / 2, 0);
      });
    }

    return sketch.add(
      rect,
      ...visLines,
      ...dottedLines,
      rightRef,
      leftRef,
      topRef
    );
  },
};
