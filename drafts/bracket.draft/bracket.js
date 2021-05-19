return {
  parameters: [
    { name: "view", default: "side" },
    { name: "wv", default: 0 },
    {
      name: "params",
      default: {
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

        angle: {
          height: 40,
          depth: 75,
          width: 200,
          trim_width: 200,
          thickness: 5,
          radius: 8,
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
  ],
  func: function (sketch, view, wv, params) {
    let wp = sketch.user[`wp_${view}`](params.wp);
    let angle = sketch.user[`angle_${view}`](params.angle);
    let compressionplate = sketch.user[
      `compressionplate_${view}`
    ](params.compression);
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
          params.angle && angle,
          adjustmentplate,
          pressureplate,
          params.compression && compressionplate,
          ...welds
        );

      case "front":
        angle = angle.translate(0, lower.y - wv);
        compressionplate = compressionplate.translate(
          0,
          -params.wp.i1
        );
        return sketch.add(
          params.compression && compressionplate,
          wp,
          adjustmentplate,
          params.angle && angle
        );

      case "top":
        angle = angle.translate(
          0,
          -params.wp.k1 - params.wp.side_lip.h
        );
        compressionplate = compressionplate.translate(
          0,
          -params.wp.side_lip.h
        );
        return sketch.add(
          params.compression && compressionplate,
          wp,
          adjustmentplate,
          params.angle && angle
        );
      default:
        break;
    }
  },
};
