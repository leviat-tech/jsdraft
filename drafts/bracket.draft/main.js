return {
  parameters: [
    { name: "k1", default: 100 },
    { name: "i1", default: 100 },
    { name: "k2", default: 50 },
    { name: "i2", default: 60 },
    { name: "radius", default: 20 },
  ],
  func: function example(sketch, k1, i1, k2, i2, radius) {
    const main = sketch.polyface(
      [0, 0],
      [0, -i1],
      [-k1, -i1],
      [[-k1, -(i1 - i2)],radius],
      [-k2, 0]
    )
    return sketch.add( main)
  }
}
