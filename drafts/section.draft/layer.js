return {
  parameters: [
    {
      name: "params",
      default: {
        datum_offset: 0 * 0.001,
        datum_reference: "top",
        is_datum: true,
        padding_bottom: -10 * 0.001,
        padding_top: 0 * 0.001,
        cavity: 10 * 0.001,
        height: 100 * 0.001,
        width: 100 * 0.001,
        concrete_grade: "C25/30",
        wall_type: "reinforced_concrete",
        description: "",
        beam_profile: "HEB 100",
        type: "wall",
      },
    },
  ],
  func: function (sketch, params) {
    const sketches = [];

    switch (params.type) {
      case "wall":
        const Wall = sketch.user
          .masonry({
            height:
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
        break;
      case "steel_beam":
        const beam = sketch.user
          .steelbeam(params.beam_profile, false)
          .translate(params.cavity, 0)
          .style("steel_beam");
        sketches.push(beam);
        break;
      default:
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
        break;
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
        .translate(0.0012, 0.008)
        .z(99);
      sketches.push(Datumline, Text);
    }
    return sketch.add(...sketches);
  },
};
