return {
  parameters: [
    { name: "height", default: 20 },
    { name: "width", default: 40 },
    { name: "offset", default: 10 },
  ],
  func: function (sketch, height, width, offset) {
    return sketch.polyface(
      [[0, -offset],height/2],
      [[width, -offset], height/2],
      [[width, -height-offset], height/2],
      [[0, -height-offset],height/2],
    )
  }
}
