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
        width: 100,
        thickness: 3,
        radius: 5,
      },
    },
  ],
  func: function (
    sketch,
    view,
    wv,
    wp_params,
    angle_params
  ) {
    let wp = sketch.user[`wp_${view}`](wp_params);
    let angle = sketch.user.angle(angle_params);
    let adjustmentplate =
      sketch.user[`adjustmentplate_${view}`]();
    let pressureplate = sketch.user.pressureplate();
    switch (view) {
      case "side":
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
        angle = angle.translate(lower.x, lower.y - wv);
        adjustmentplate = adjustmentplate.translate(
          upper.x,
          upper.y
        );
        pressureplate = pressureplate.translate(
          upper.x,
          upper.y
        );

        //     const w1 = sketch.new.add(angle.edge(0));
        //     const w2 = sketch.new.add(adjustmentplate.edge(0));
        const w3 = sketch.new.add(wp.edge(7));

        //     const welds = [w3].map(w=>{return w.user.weld("left")})

        return sketch.add(
          wp,
          angle,
          adjustmentplate,
          pressureplate,
          w3.user.weld("left")
        );

      case "front":
        return sketch.add(wp, adjustmentplate);

      default:
        break;
    }
  },
};
