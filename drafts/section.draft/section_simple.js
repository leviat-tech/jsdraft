return {
  parameters: [
    {
      name: "params",
      default: {
        id: "056d1c31-20cd-41e3-a190-e12b740085b8",
        number: 1,
        name: "Section 1",
        layers: [
          {
            datum_offset: 0 * 0.001,
            datum_reference: "top",
            padding_bottom: -10 * 0.001,
            padding_top: 0 * 0.001,
            cavity: 150 * 0.001,
            width: 100 * 0.001,
            height: 300 * 0.001,
            wall_type: "masonry",
            beam_profile: "HEB 100",
            type: "wall",
          },
          {
            datum_offset: 0 * 0.001,
            datum_reference: "top",
            padding_bottom: -10 * 0.001,
            padding_top: 0 * 0.001,
            cavity: 250 * 0.001,
            height: 0 * 0.001,
            wall_type: "masonry",
            beam_profile: "HEB 100",
            type: "finish",
          },
          {
            datum_offset: 0 * 0.001,
            datum_reference: "top",
            padding_bottom: 0 * 0.001,
            padding_top: 10 * 0.001,
            is_datum: true,
            cavity: 140 * 0.001,
            height: 120 * 0.001,
            wall_type: "reinforced_concrete",
            beam_profile: "HEB 100",
            type: "concrete_slab",
          },
          {
            datum_offset: 0 * 0.001,
            datum_reference: "top",
            padding_bottom: 0 * 0.001,
            padding_top: 10 * 0.001,
            cavity: 200 * 0.001,
            height: 150 * 0.001,
            wall_type: "reinforced_concrete",
            beam_profile: "HEB 100",
            type: "steel_beam",
          },
        ],
        masonry: {
          drop: 190 * 0.001,
          specific_weight: 1.8 * 0.001,
          thickness: 100 * 0.001,
          material: "masonry",
        },
        description: "",
      },
    },
    { name: "width", default: 500 * 0.001 },
  ],
  func: function (sketch, params, width) {
    const sketches = [];
    let Datum = { x: 0, y: 0 };
    let Stackheight = 0;
    params.layers.forEach((layer) => {
      const Layer = sketch.user
        .layer({
          ...layer,
          width: layer.width
            ? layer.width
            : width - layer.cavity,
        })
        .translate(0, -Stackheight);

      if (layer.is_datum) {
        Datum = Layer.find("datum").vertices[0];
      }

      Stackheight += layer.height;
      sketches.push(Layer);
    });
    const Masonry = sketch.user
      .masonry({
        ...params.masonry,
        height: params.masonry.drop - Datum.y,
      })
      .translate(0, Datum.y - params.masonry.drop);
    sketches.push(Masonry);
    return sketch.add(...sketches).translate(0, -Datum.y);
  },
};
