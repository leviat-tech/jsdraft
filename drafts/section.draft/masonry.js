return {
  parameters: [
    {
      name: "params",
      default: {
        drop: 150,
        specific_weight: 1.8,
        thickness: 100,
        material: "masonry",
      },
    },
  ],
  func: function (sketch, params) {
    const sketches = [];
    let MUheight = 65;
    const mortar = 10;
    let count = Math.floor(
      params.drop / (mortar + MUheight)
    );
    MUheight = params.drop / count - mortar;
    const Style = {
      finish: {
        hatch: ["crosshatch", 1, 0, "black", "none"],
        stroke: ["black", 0.5],
      },
      steel_beam: {
        hatch: ["steel", 1, 0, "black", "none"],
        stroke: ["black", 2],
      },
      concrete_beam: {
        hatch: ["concrete", 1, 0, "black", "none"],
        stroke: ["black", 2],
      },
      concrete_slab: {
        hatch: ["concrete", 1, 0, "black", "none"],
        stroke: ["black", 2],
      },
      reinforced_concrete: {
        hatch: ["concrete", 1, 0, "black", "none"],
        stroke: ["black", 2],
      },
      concrete: {
        hatch: ["concrete", 1, 0, "black", "none"],
        stroke: ["black", 2],
      },
    };
    if (params.material === "masonry") {
      for (
        i = 0;
        i * (MUheight + mortar) < params.drop;
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
        .rectangle(0, 0, -params.thickness, params.drop)
        .stroke(...Style[params.material].stroke)
        .hatch(...Style[params.material].hatch);
      sketches.push(wall);
    }
    return sketch.add(...sketches);
  },
};
