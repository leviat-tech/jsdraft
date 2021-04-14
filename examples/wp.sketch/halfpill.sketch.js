return {
  parameters: [
    { name: "height", default: 20 },
    { name: "width", default: 40 },
  ],
  func: function (sketch, height, width) {
    return sketch.polyface(
      [0, 0],
      [[-width, 0], height/2],
      [[-width, -height], height/2],
      [0, -height],
    )
  }
}
