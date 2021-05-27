return {
  parameters: [
    {
      name: "params",
      default: {
        height: 45,
        width: 10,
        thickness: 5,
        radius: 5,
      },
    },
  ],
  func: function (sketch, params) {
    const outer = sketch
      .polycurve(
        [0, 0],
        [0, params.height],
        [-params.width, params.height]
      )
      .fillet(params.radius);
    const inner = outer.offset(params.thickness);
    const top = sketch.polycurve(
      outer.vertices[0],
      inner.vertices[0]
    );
    const bottom = sketch.polycurve(
      inner.vertices.slice(-1)[0],
      outer.vertices.slice(-1)[0]
    );
    const angle = sketch.new
      .add(outer, inner, top, bottom)
      .join()
      .translate(params.thickness, 0);

    return sketch.add(angle);
  },
};
