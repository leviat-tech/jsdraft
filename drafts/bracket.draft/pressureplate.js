return {
  parameters: [
    { name: "height", default: 45 },
    { name: "width", default: 10 },
    { name: "thickness", default: 5 },
    { name: "radius", default: 5 }
  ],
  func: function (sketch, height, width, thickness, radius) {
    const outer = sketch.polycurve(
      [0, 0],
      [0,height],
      [-width, height]
    ).fillet(radius);
    const inner = outer.offset(thickness)
    const top = sketch.polycurve(
      outer.vertices[0],
      inner.vertices[0],
      )
    const bottom = sketch.polycurve(
      inner.vertices.slice(-1)[0],
      outer.vertices.slice(-1)[0],
      )
    const angle = sketch.new.add(outer, inner, top, bottom)
    .join().translate(thickness, 0)
    
    return sketch.add(angle)
  }
}

