return {
  parameters: [
    {
      name: "params",
      default: { h: 20, w: 40, offset: 10 },
    },
  ],
  func: function (sketch, params) {
    const ref = sketch
      .polycurve([params.w, 0], [0, 0])
      .name("ref")
      .hide();

    const pill = sketch.polyface(
      [[0, -params.offset], params.h / 2],
      [[params.w, -params.offset], params.h / 2],
      [[params.w, -params.h - params.offset], params.h / 2],
      [[0, -params.h - params.offset], params.h / 2]
    );

    return sketch.add(pill, ref);
  },
};
