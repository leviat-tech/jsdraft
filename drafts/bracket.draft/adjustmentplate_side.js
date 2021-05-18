return {
  parameters: [
    { name: "params", default: 
    {
    height: 70 ,
    depth: 40 ,
    width: 15,
    overhang: {height: 5, depth: 3} ,
    cutout: {height: 5,depth: 3} ,
    teeth: {height:5, depth: 5, positions:[0, 10, 20]},
    }
  }
  ],
  func: function (sketch, params) {
   const back = sketch
  .polycurve(
    [0, 0],
    [0,-params.teeth.depth],
    [params.teeth.height,-params.teeth.depth],
    [params.teeth.height,0]
  )
  .interpolate([0, 0], [0, -30], params.teeth.positions).translate(0,params.height-params.overhang.height);

  const plate = sketch.polyface(
    [0,0],
    [-params.depth, 0],
    [-params.depth, params.height-params.cutout.height],
    [-params.depth+params.cutout.depth, params.height-params.cutout.height],
    [-params.depth+params.cutout.depth, params.height],
    [params.overhang.depth,params.height],
    [params.overhang.depth,params.height-params.overhang.height],
    ...back.vertices,
    )

    return sketch.add(plate)
  }
}

