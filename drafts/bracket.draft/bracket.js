return {
  parameters: [
    { name: "wv", default: 0 },
  ],
  func: function (sketch, wv) {
    const wp = sketch.user.wp()
    let lower = {x:Infinity, y: Infinity}
    let upper = {x:-Infinity, y: -Infinity}
    wp.vertices.forEach(v =>{ 
      if (v.x<lower.x){
      lower.x = v.x
      }
      if (v.y<lower.y){
      lower.y = v.y
      }
      if (v.x>upper.x){
      upper.x = v.x
      }
      if (v.y>upper.y){
      upper.y = v.y
      } 
    })
    const angle = sketch.user.angle().translate(lower.x, lower.y-wv)
    const adjustmentplate = sketch.user.adjustmentplate().translate(upper.x, upper.y)
    const pressureplate = sketch.user.pressureplate().translate(upper.x, upper.y)
    return sketch.add(angle,wp, adjustmentplate, pressureplate)
  }
}

