return {
  parameters: [
    { name: "height", default: 300 },
    { name: "thickness", default: 112.5 },
    { name: "material", default: "clay" },
    { name: "mortar", default: 10}
  ],
  func: function (sketch, drop, thickness, material, mortar) {
    const sketches =[];
    const MUheight= 65;
    for (i = 0; i*(MUheight+mortar) < drop; i++) {
      const MU = sketch.user
      .masonryunit(thickness, MUheight, material, [{edge:2, thickness: mortar}])
      .translate(-thickness,i*(MUheight+mortar))
      sketches.push(MU)
    }
    return sketch.add(...sketches);
  }
}