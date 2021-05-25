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
            datum_offset: 0,
            datum_reference: "top",
            padding_bottom: -10,
            padding_top: 0,
            cavity: 60,
            width: 70,
            height: 300,
            wall_type: "masonry",
            beam_profile: "HEB 100",
            type: "wall",
          },
          {
            datum_offset: 0,
            datum_reference: "top",
            padding_bottom: 0,
            padding_top: 10,
            is_datum: true,
            cavity: 50,
            height: 100,
            wall_type: "reinforced_concrete",
            beam_profile: "HEB 100",
            type: "concrete_slab",
          },
          {
            datum_offset: 0,
            datum_reference: "top",
            padding_bottom: 0,
            padding_top: 0,
            cavity: 100,
            width: 70,
            height: 30,
            wall_type: "reinforced_concrete",
            beam_profile: "HEB 100",
            type: "steel_beam",
          },
        ],
        masonry: {
          drop: 150,
          specific_weight: 1.8,
          thickness: 100,
          material: "concrete",
        },
        description: "",
      },
    },
    { name: "width", default: 500 },
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
