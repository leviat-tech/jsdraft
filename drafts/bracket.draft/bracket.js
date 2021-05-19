return {
  parameters: [
    { name: "view", default: "side" },
    { name: "wv", default: 0 },
    {
      name: "wp_params",
      default: {
        k1: 100,
        i1: 100,
        k2: 50,
        i2: 60,
        radius: 10,
        thickness: 5,
        hole: { r: 5, offset: 10 },
        halfpill: { h: 20, w: 40, bottom: 15 },
        void: { h: 25, w: 60, offset: 20 },
        side_lip: { h: 10, bw: 50, tw: 30 },
        bottom_lip: { h: 10, bw: 70, tw: 50 },
      },
    },
    {
      name: "angle_params",
      default: {
        height: 50,
        depth: 100,
        width: 200,
        thickness: 3,
        radius: 5,
      },
    },
    {
      name: "compress_params",
      default: {
        height: 15,
        depth: 30,
        width: 40,
        layers: 2,
        overhang: 5,
      },
    },
  ],
  func: function (
    sketch,
    view,
    wv,
    wp_params,
    angle_params,
    compress_params
  ) {
    let wp = sketch.user[`wp_${view}`](wp_params);
    let angle = sketch.user[`angle_${view}`](angle_params);
    let compressionplate =
      sketch.user[`compressionplate_${view}`](
        compress_params
      );
    let adjustmentplate =
      sketch.user[`adjustmentplate_${view}`]();
    let pressureplate = sketch.user.pressureplate();

    let lower = { x: Infinity, y: Infinity };
    let upper = { x: -Infinity, y: -Infinity };
    wp.vertices.forEach((v) => {
      if (v.x < lower.x) {
        lower.x = v.x;
      }
      if (v.y < lower.y) {
        lower.y = v.y;
      }
      if (v.x > upper.x) {
        upper.x = v.x;
      }
      if (v.y > upper.y) {
        upper.y = v.y;
      }
    });
    switch (view) {
      case "side":
        const bottom = wp.hidden.find("bottom").show();
        const compressRef = compressionplate.hidden
          .find("ref")
          .show();
        compressionplate = compressionplate.snap(
          bottom.edge(0),
          compressRef.edge(0),
          0,
          true
        );
        angle = angle.translate(lower.x, lower.y - wv);
        adjustmentplate = adjustmentplate.translate(
          upper.x,
          upper.y
        );
        pressureplate = pressureplate.translate(
          upper.x,
          upper.y
        );

        const w1 = sketch.new.add(angle.edge(0));
        const w2 = adjustmentplate.hidden
          .find("ref")
          .show();
        const w3 = compressionplate.hidden
          .find("ref")
          .show();

        const welds = [w1, w2, w3].map((w) => {
          return w.user.weld("left");
        });

        return sketch.add(
          wp,
          angle,
          adjustmentplate,
          pressureplate,
          compressionplate,
          ...welds
        );

      case "front":
        angle = angle.translate(0, lower.y - wv);
        compressionplate = compressionplate.translate(
          0,
          -wp_params.i1
        );
        return sketch.add(
          compressionplate,
          wp,
          adjustmentplate,
          angle
        );

      default:
        break;
    }
  },
};
