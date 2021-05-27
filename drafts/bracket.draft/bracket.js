return {
  parameters: [
    { name: "view", default: "side" },
    {
      name: "params",
      default: {
        wp: {
          k1: 90 * 0.001,
          i1: 100 * 0.001,
          k2: 40 * 0.001,
          i2: 60 * 0.001,
          radius: 10 * 0.001,
          thickness: 5 * 0.001,
          hole: { r: 5 * 0.001, offset: 10 * 0.001 },
          void: {
            h: 30 * 0.001,
            w: 45 * 0.001,
            offset: 20 * 0.001,
          },
          side_lip: {
            h: 10 * 0.001,
            bw: 70 * 0.001,
            tw: 30 * 0.001,
          },
          bottom_lip: {
            h: 8 * 0.001,
            bw: 50 * 0.001,
            tw: 40 * 0.001,
          },
        },
        compression: {
          height: 15 * 0.001,
          depth: 30 * 0.001,
          width: 40 * 0.001,
          layers: 2,
          overhang: 5 * 0.001,
        },
        pressure_plate: {
          height: 45 * 0.001,
          width: 10 * 0.001,
          thickness: 5 * 0.001,
          radius: 5 * 0.001,
        },
        adjustment_plate: {
          height: 70 * 0.001,
          depth: 40 * 0.001,
          width: 20 * 0.001,
          thickness: 5 * 0.001,
          overhang: { height: 5 * 0.001, depth: 3 * 0.001 },
          hole: {
            x: 10 * 0.001,
            y: 10 * 0.001,
            d: 5 * 0.001,
          },
          cutout: { height: 5 * 0.001, depth: 3 * 0.001 },
          teeth: {
            height: 5 * 0.001,
            depth: 5 * 0.001,
            positions: [0 * 0.001, 10 * 0.001, 20 * 0.001],
          },
        },
      },
    },
    { name: "wv", default: 0 * 0.001 },
  ],
  func: function (sketch, view, params, wv) {
    let wp = sketch.user[`wp_${view}`](params.wp);
    let compressionplate = sketch.user[
      `compressionplate_${view}`
    ](params.compression);
    let adjustmentplate = sketch.user[
      `adjustmentplate_${view}`
    ](params.adjustment_plate);
    let pressureplate = sketch.user.pressureplate(
      params.pressure_plate
    );

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
        adjustmentplate = adjustmentplate.translate(
          upper.x,
          upper.y
        );
        pressureplate = pressureplate.translate(
          upper.x,
          upper.y
        );

        const w2 = adjustmentplate.hidden
          .find("ref")
          .show();
        const w3 = compressionplate.hidden
          .find("ref")
          .show();

        const welds = [w2, w3].map((w) => {
          return w.user.weld("left");
        });

        return sketch
          .add(
            wp,
            adjustmentplate,
            pressureplate,
            params.compression && compressionplate,
            ...welds
          )
          .translate(-lower.x, -lower.y + wv);

      case "front":
        compressionplate = compressionplate.translate(
          0,
          -params.wp.i1
        );
        return sketch
          .add(
            params.compression && compressionplate,
            wp,
            adjustmentplate
          )
          .translate(0, -lower.y + wv);

      case "top":
        compressionplate = compressionplate.translate(
          0,
          -params.wp.side_lip.h
        );
        return sketch
          .add(
            params.compression && compressionplate,
            wp,
            adjustmentplate
          )
          .translate(
            0,
            params.wp.k1 + params.wp.side_lip.h
          );
      default:
        break;
    }
  },
};
