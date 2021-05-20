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
          left: { type: "miter", params: {} },
          right: { type: "angle", params: {} },
        },
        brackets: [
          {
            position: 40,
            wv: 0,
            params: {
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
            params: {
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
    let angle = sketch.user[`angle_${view}`](params.angle);
    let brackets = [];
    switch (view) {
      case "side":
        brackets = params.brackets.map((bracket) => {
          return sketch.user
            .bracket(view, bracket.params, bracket.wv)
            .z(bracket.position);
        });
        return sketch
          .add(...brackets, angle)
          .translate(params.angle.thickness, 0);

      default:
        angle = angle.translate(params.angle.width / 2, 0);
        if (params.angle.left && view === "top") {
          angle =
            angle.user[`edge_${params.angle.left.type}`](
              "left"
            );
        }
        if (params.angle.right && view === "top") {
          angle =
            angle.user[`edge_${params.angle.right.type}`](
              "right"
            );
        }
        brackets = params.brackets.map((bracket) => {
          return sketch.user
            .bracket(view, bracket.params, bracket.wv)
            .translate(bracket.position, 0);
        });
        return sketch.add(...brackets, angle);
    }
  },
};
