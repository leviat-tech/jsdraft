return {
  parameters: [
    {
      name: "params",
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
  ],
  func: function wp(sketch, params) {
    const height =
      params.i1 +
      (params.bottom_lip ? params.bottom_lip.h : 0) +
      (params.leg ? params.leg.h : 0) +
      (params.toe ? params.toe.h : 0);
    return sketch.rectangle(
      -params.thickness / 2,
      0,
      params.thickness / 2,
      -height
    );
  },
}
