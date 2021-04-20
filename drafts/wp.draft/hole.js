return {
  parameters: [
    { name: "radius", default: 10 },
  ],
  func: function hole (sketch, radius) {
  return sketch.circle([0, 0], radius);
}
}
