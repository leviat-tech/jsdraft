return {
  parameters: [
    { name: "wv", default: 0 },
  ],
  func: function (sketch, wv) {
    const wp = sketch.user.wp()
    let lower = {x:Infinity, y: Infinity}
    wp.vertices.forEach(v =>{ 
      if (v.x<lower.x){
      lower.x = v.x
      }
      if (v.y<lower.y){
      lower.y = v.y
      }                     
    })
    const angle = sketch.user.angle().translate(lower.x, lower.y-wv)
    const adjustmentplate = sketch.user.adjustmentplate()
    const pressureplate = sketch.user.pressureplate()
    return sketch.add(angle,wp, adjustmentplate, pressureplate)
  }
}

