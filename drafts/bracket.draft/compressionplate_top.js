return {
  parameters: [
    {
      name: "params",
      default: {
        height: 10,
        depth: 30,
        width: 40,
        layers: 2,
        overhang: 5,
      },
    },
  ],
  func: function (sketch, params) {
    const rect = sketch.rectangle(
      -params.width / 2,
      0,
      params.width / 2,
      -params.depth
    ).translate(0, params.overhang);

    return sketch.add(rect);
  },
};
