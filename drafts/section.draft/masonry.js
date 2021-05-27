return {
  parameters: [
    {
      name: "params",
      default: {
        drop: 150 * 0.001,
        specific_weight: 1.8,
        thickness: 100 * 0.001,
        material: "masonry",
        height: 250 * 0.001,
      },
    },
  ],
  func: function (sketch, params) {
    const sketches = [];
    let MUheight = 65 * 0.001;
    const mortar = 10 * 0.001;
    let count = Math.floor(
      params.height / (mortar + MUheight)
    );
    MUheight = params.height / count - mortar;
    if (params.material === "masonry") {
      for (
        i = 0;
        i * (MUheight + mortar) < params.height;
        i++
      ) {
        const MU = sketch.user
          .masonryunit(
            params.thickness,
            MUheight,
            params.material,
            [{ edge: 2, thickness: mortar }]
          )
          .translate(
            -params.thickness,
            i * (MUheight + mortar)
          );
        sketches.push(MU);
      }
    } else {
      const wall = sketch.new
        .rectangle(0, 0, -params.thickness, params.height)
        .style(params.material);
      sketches.push(wall);
    }
    return sketch.add(...sketches);
  },
};
