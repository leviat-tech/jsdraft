return {
  parameters: [
    { name: "width", default: 100 },
    { name: "height", default: 30 },
    { name: "radius", default: 10 },
  ],
  func: function (sketch, width, height, radius) {
    return sketch.polyface(
      [0, 0],
      [width+radius, 0],
      [[width, 0], radius],
      [width, height],
      [0,height]
    )
  }
}