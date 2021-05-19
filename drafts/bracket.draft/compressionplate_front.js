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
    const layerHt = params.height / params.layers;
    const layers = [];
    const layer = sketch.rectangle(
      -params.width / 2,
      0,
      params.width / 2,
      -layerHt
    );

    for (i = 0; i < params.layers; i++) {
      layers.push(layer.translate(0, -layerHt * i));
    }

    return sketch.add(...layers);
  },
};
