return {
  parameters: [
    {
      name: "params",
      default: {
        height: 50,
        width: 100,
        length: 200,
        trim_length: 200,
        thickness: 3,
        radius: 10,
      },
    },
  ],
  func: function (sketch, params) {
    const outer = sketch
      .polycurve(
        [0, params.height],
        [0, 0],
        [-params.width, 0]
      )
      .fillet(params.radius);
    const inner = outer.offset(-params.thickness);
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
      .translate(0, -params.thickness);

    return sketch.add(angle);
  },
};
