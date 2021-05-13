return {
  parameters: [
    { name: "height", default: 70 },
    { name: "width", default: 40 },
    { name: "overhang", default: {height: 5, width: 3} },
    { name: "cutout", default: {height: 5,width: 3} },
    { name: "teeth", default: {height:5, depth: 5, positions:[0, 10, 20]}}
  ],
  func: function (sketch, height, width, overhang, cutout, teeth) {
   const back = sketch
  .polycurve(
    [0, 0],
    [0,-teeth.depth],
    [teeth.height,-teeth.depth],
    [teeth.height,0]
  )
  .interpolate([0, 0], [0, -30], teeth.positions).translate(0,height-overhang.height);

  const plate = sketch.polyface(
    [0,0],
    [-width, 0],
    [-width, height-cutout.height],
    [-width+cutout.width, height-cutout.height],
    [-width+cutout.width, height],
    [overhang.width,height],
    [overhang.width,height-overhang.height],
    ...back.vertices,
    )

    return sketch.add(plate)
  }
}

