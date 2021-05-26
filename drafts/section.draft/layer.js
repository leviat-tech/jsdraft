return {
  parameters: [
    {
      name: "params",
      default: {
        datum_offset: 0,
        datum_reference: "top",
        is_datum: true,
        padding_bottom: -10,
        padding_top: 0,
        cavity: 10,
        height: 100,
        width: 100,
        concrete_grade: "C25/30",
        wall_type: "reinforced_concrete",
        description: "",
        beam_profile: "HEB 100",
        type: "steel_beam",
      },
    },
  ],
  func: function (sketch, params) {
    const sketches = [];
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
    };
    if (params.type != "wall") {
      const Layer = sketch
        .polyface(
          [
            params.cavity + params.width,
            -params.padding_top,
          ],
          [params.cavity, -params.padding_top],
          [
            params.cavity,
            -params.height + params.padding_bottom,
          ],
          [
            params.cavity + params.width,
            -params.height + params.padding_bottom,
          ]
        )
        .style(params.type);
      sketches.push(Layer);
    } else {
      const Wall = sketch.user
        .masonry({
          drop:
            params.height -
            params.padding_bottom -
            params.padding_top,
          thickness: params.width,
          material: params.wall_type,
        })
        .translate(
          params.width + params.cavity,
          -params.height + params.padding_bottom
        );
      sketches.push(Wall);
    }

    if (params.is_datum) {
      const Offset = {
        top: -params.datum_offset,
        bottom: params.datum_offset + params.height,
        middle: params.height / 2 - params.datum_offset,
      };
      const Datumline = sketch.new
        .polycurve(
          [0, 0],
          [params.cavity + params.width, 0]
        )
        .offset(-Offset[params.datum_reference])
        .style("datum")
        .name("datum")
        .z(99);
      const Text = sketch.new
        .text("0.00", Datumline.vertices[0])
        .translate(12, 8)
        .z(99);
      sketches.push(Datumline, Text);
    }
    return sketch.add(...sketches);
  },
};
