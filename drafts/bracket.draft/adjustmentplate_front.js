return {
  parameters: [
    { name: "params", default: 
    {
    height: 70 ,
    depth: 40 ,
    width: 15,
    thickness: 5,
    overhang: {height: 5, width: 3} ,
    cutout: {height: 5,width: 3} ,
    teeth: {height:5, depth: 5, positions:[0, 10, 20]},
    }
  }
  ],
  func: function (sketch, params) {
   const inner = sketch
  .polycurve(
    [params.width/2, params.height],
    [params.width/2, params.width/2+params.thickness],
    -1, 
    [-params.width/2, params.width/2+params.thickness],
    [-params.width/2, params.height]
  )
  
    const outer = inner.offset(params.thickness);
    
    const left = sketch.polycurve(
      outer.vertices[0],
      inner.vertices[0],
      )
    const right = sketch.polycurve(
      inner.vertices.slice(-1)[0],
      outer.vertices.slice(-1)[0],
      )
    const U = sketch.new.add(outer, inner, left, right).join()

    return sketch.add(U)
  }
}

