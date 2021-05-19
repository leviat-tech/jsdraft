return {
  parameters: [
    { name: "view", default: "top" },
    {
      name: "params",
      default: {
        angle: {
          height: 40,
          depth: 75,
          width: 500,
          thickness: 5,
          radius: 8,
        },
        brackets: [
          {
            position: 40,
            params: {
              wp: {
                k1: 90,
                i1: 100,
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
            params: {
              wp: {
                k1: 120,
                i1: 150,
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
                depth: 10,
                width: 40,
                layers: 2,
                overhang: 10,
              },
            },
          },
        ],
      },
    },
    { name: "wv", default: 0 },
  ],
  func: function wp(sketch, view, params, wv) {
    const angle = sketch.user[`angle_${view}`](
      params.angle
    ).translate(params.angle.width / 2, 0);
    const brackets = params.brackets.map((bracket) => {
      return sketch.user
        .bracket(view, bracket.params, wv)
        .translate(bracket.position, 0);
    });
    return sketch.add(...brackets, angle);
  },
};
