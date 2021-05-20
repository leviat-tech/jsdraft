return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        depth: 100,
        width: 400,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    let lineHts = [-params.thickness];
    let stroke = "black";
    let dottedLines = [];
    let width = params.width;
    if (params.trim_width) {
      lineHts.push(0);
      lineHts.push(-params.height);
      stroke = "transparent";
      width = params.trim_width;
    }
    const rect = sketch
      .rectangle(-width / 2, 0, width / 2, -params.height)
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

    if (params.trim_width) {
      const middle = sketch
        .polycurve([0, 10], [0, -params.height - 10])
        .linestyle(15, 2, 2, 5);

      dottedLines = [-1, 1].map((dir) => {
        return middle.translate((dir * width) / 2, 0);
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
