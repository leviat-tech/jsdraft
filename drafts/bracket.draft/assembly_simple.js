return {
  parameters: [
    { name: "view", default: "front" },
    {
      name: "params",
      default: {
        id: "acee734a-3770-4b2a-bb93-33416db317e6",
        name: "Assembly 1",
        number: 1,
        brackets: [
          {
            id: "60820f54-3db0-4825-b90e-8129180cd3fb",
            name: "Bracket 1",
            number: 1,
            assembly_id:
              "acee734a-3770-4b2a-bb93-33416db317e6",
            assembly: null,
            anchoring: {
              type: "Fischer-FV",
              length: 0.15,
              depth: 0.1,
            },
            dimensions: {
              leg_width: 0,
              V: 0,
              X: 0,
              K: 0,
            },
            load: {
              max: 0,
              actual: 0,
            },
            plate_thickness: 5,
            adjustability: 0,
            family: "GH",
            position: 100,
          },
        ],
        zone_id: "b4e2aee9-6aa3-4da5-a207-97db76fdf11e",
        zone: null,
        profile: {
          thickness: 5,
          height: 30,
          width: 50,
          length: 500,
          radius: 10,
          family: "angle",
        },
        status: "unchecked",
        position: 100,
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
            .bracket(view)
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
