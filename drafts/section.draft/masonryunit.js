return {
  parameters: [
    { name: "width", default: 112.5 },
    { name: "height", default: 65 },
    { name: "material", default: "masonry" },
    {
      name: "mortars",
      default: [
        { edge: 0, thickness: 5 },
        { edge: 3, thickness: 10 },
      ],
    },
  ],
  func: function (
    sketch,
    width,
    height,
    material,
    mortars
  ) {
    const Block = sketch
      .polyface(
        [0, 0],
        [width, 0],
        [width, height],
        [0, height]
      )
      .style(material);

    const Mortars = [];
    mortars.forEach((mortar) => {
      const edge1 = sketch.new.add(Block.edge(mortar.edge));
      const edge2 = edge1.offset(-mortar.thickness);
      const MortarRight = sketch.arc(
        edge1.vertices[0],
        -1,
        edge2.vertices[0]
      );
      const MortarLeft = sketch.arc(
        edge1.vertices[1],
        1,
        edge2.vertices[1]
      );
      const Mortar = sketch.new
        .add(MortarRight, MortarLeft, edge1, edge2)
        .join()
        .style("mortar");
      Mortars.push(Mortar);
    });

    return sketch.add(Block, ...Mortars);
  },
};
