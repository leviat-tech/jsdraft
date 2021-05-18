return {
  parameters: [
    { name: "wv", default: 0 },
    { name: "wp_params", default: {
      k1: 100 ,
      i1: 100 ,
      k2: 50 ,
      i2: 60 ,
      radius: 10 ,
      hole: {r:5, offset: 10} ,
      halfpill: {h:20, w: 40, bottom: 15} ,
      void: {h: 25, w: 60, offset: 20},
      side_lip: {h: 10, bw:50, tw:30} ,
      bottom_lip: {h: 10, bw:70, tw:50} ,
      }}
  ],
  func: function (sketch, wv, wp_params) {
    const wp = sketch.user.wp(wp_params)
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
    
//     const w1 = sketch.new.add(angle.edge(0));
//     const w2 = sketch.new.add(adjustmentplate.edge(0));
    const w3 = sketch.new.add(wp.edge(3));
    
//     const welds = [w3].map(w=>{return w.user.weld("left")})
    
    return sketch.add( wp, angle, adjustmentplate, pressureplate)
  }
}

