return {
  parameters: [
    {
      name: "params",
      default: {
        height: 15,
        depth: 30,
        width: 40,
        layers: 2,
        overhang: 5,
      },
    },
  ],
  func: function (sketch, params) {
    const layerHt = params.height / params.layers;
    const layers = [];
    const layer = sketch.rectangle(
      -params.depth / 2,
      0,
      params.depth / 2,
      -layerHt
    );

    for (i = 0; i < params.layers; i++) {
      layers.push(layer.translate(0, -layerHt * i));
    }

    const ref = sketch
      .polycurve(
        [-params.depth / 2 + params.overhang, 0],
        [params.depth / 2, 0]
      )
      .name("ref")
      .hide();

    return sketch.add(...layers, ref);
  },
};
