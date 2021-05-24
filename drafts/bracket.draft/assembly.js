return {
  parameters: [
    { name: "view", default: "side" },
    {
      name: "params",
      default: {
        profile: {
          family: "angle",
          height: 40,
          width: 75,
          length: 500,
          thickness: 5,
          radius: 8,
          left: { type: "plate", params: {} },
          right: { type: "angle", params: {} },
        },
        brackets: [
          {
            position: 40,
            wv: 0,
            dimenstions: {
              wp: {
                k1: 90,
                i1: 118,
                k2: 40,
                i2: 60,
                radius: 10,
                thickness: 5,
                hole: { r: 5, offset: 10 },
                void: { h: 30, w: 45, offset: 20 },
                side_lip: { h: 10, bw: 70, tw: 30 },
                bottom_lip: { h: 8, bw: 50, tw: 40 },
              },
              compression: {
                height: 15,
                depth: 30,
                width: 40,
                layers: 2,
                overhang: 5,
              },
            },
          },
          {
            position: 180,
            wv: 5,
            dimenstions: {
              wp: {
                k1: 122,
                i1: 100,
                k2: 60,
                i2: 70,
                radius: 10,
                thickness: 5,
                hole: { r: 5, offset: 10 },
                void: { h: 30, w: 45, offset: 20 },
                side_lip: { h: 10, bw: 70, tw: 30 },
                bottom_lip: { h: 8, bw: 80, tw: 60 },
              },
              compression: {
                height: 15,
                depth: 38,
                width: 40,
                layers: 2,
                overhang: 10,
              },
            },
          },
        ],
      },
    },
  ],
  func: function wp(sketch, view, params) {
    let profile = sketch.user[
      `${params.profile.family}_${view}`
    ](params.profile);
    let brackets = [];
    switch (view) {
      case "side":
        brackets = params.brackets.map((bracket) => {
          return sketch.user
            .bracket(view, bracket.dimenstions, bracket.wv)
            .z(bracket.position);
        });
        return sketch
          .add(...brackets, profile)
          .translate(params.profile.thickness, 0);

      default:
        profile = profile.translate(
          params.profile.length / 2,
          0
        );
        if (params.profile.left && view === "top") {
          profile =
            profile.user[
              `edge_${params.profile.left.type}`
            ]("left");
        }
        if (params.profile.right && view === "top") {
          profile =
            profile.user[
              `edge_${params.profile.right.type}`
            ]("right");
        }
        brackets = params.brackets.map((bracket) => {
          return sketch.user
            .bracket(view, bracket.params, bracket.wv)
            .translate(bracket.position, 0);
        });
        return sketch.add(...brackets, profile);
    }
  },
};
