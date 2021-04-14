return {
  parameters: [
    { name: "height", default: 20 },
    { name: "base_width", default: 100 },
    { name: "top_width", default: 50 },
  ],
  func: function (sketch, height, base_width, top_width) {
    return sketch.polyface(
      [0, 0],
      [0, height],
      [top_width, height],
      [base_width, 0],
      [base_width, 0],
    )
  }
}
