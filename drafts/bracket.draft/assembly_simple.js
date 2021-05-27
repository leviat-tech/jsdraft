return {
  parameters: [
    { name: "view", default: "front" },
    {
      name: "params",
      default: {
        id: "c4ffb16e-b86d-4874-b79b-444df852aa49",
        name: "Assembly 1",
        number: 1,
        brackets: [
          {
            id: "19c6224e-aa89-4695-b283-f86b994b701e",
            name: "Bracket 1",
            number: 1,
            assembly_id:
              "c4ffb16e-b86d-4874-b79b-444df852aa49",
            assembly: null,
            anchoring: {
              type: "HTA+HS-FV",
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
            plate_thickness: 5 * 0.001,
            adjustability: 0 * 0.001,
            family: "GH",
            position: 100 * 0.001,
          },
        ],
        zone_id: "c10f05d9-a9ee-478e-b310-fb619f06b8d3",
        zone: {
          id: "c10f05d9-a9ee-478e-b310-fb619f06b8d3",
          number: 1,
          name: "Zone 1",
          segments: [],
          assemblies: [],
          sections: [],
          material_preferences: {
            custom_color: "",
            gloss_level: 0,
            ral_color: "STD",
            paint_coats: 1,
            material: "WBS235 FV",
          },
          right_edge_condition: {
            B: 30 * 0.001,
            L: 150 * 0.001,
            side: "back",
            angle: 45,
            type: "plate",
          },
          left_edge_condition: {
            B: 40 * 0.001,
            L: 105 * 0.001,
            side: "back",
            angle: 45,
            type: "plate",
          },
          quantity: 1,
          group: "",
          description: "",
        },
        profile: {
          thickness: 5 * 0.001,
          height: 50 * 0.001,
          width: 70 * 0.001,
          length: 800 * 0.001,
          radius: 5 * 0.001,
          family: "angle",
        },
        status: "unchecked",
        position: 0,
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
        if (
          params.zone.left_edge_condition &&
          view === "top"
        ) {
          profile = profile.user[
            `edge_${params.zone.left_edge_condition.type}`
          ]("left", params.zone.left_edge_condition);
        }
        if (
          params.zone.right_edge_condition &&
          view === "top"
        ) {
          profile = profile.user[
            `edge_${params.zone.right_edge_condition.type}`
          ]("right", params.zone.right_edge_condition);
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
