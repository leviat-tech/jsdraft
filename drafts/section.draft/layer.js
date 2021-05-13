return {
  parameters: [
    { name: "height", default: 100 },
    { name: "width", default: 100 },
    { name: "cavity", default: 30 },
    { name: "datum", default: null },
    { name: "material", default: "concrete" },
    { name: "infinite", default: true },
    { name: "padding_bottom", default: 0 },
    { name: "padding_top", default: 0 },
  ],
  func: function (sketch, height, width, cavity, datum, material, infinite, padding_bottom, padding_top) {
    const sketches =[];
    const Style={
      wood: {hatch:["crosshatch", 1, 0, 'black', 'none'], stroke:["black",.5],}, 
      steel:{hatch:["steel", 1, 0, 'black', 'none'], stroke:["black",2]}, 
      concrete:{hatch:["concrete", 1, 0, 'black', 'none'], stroke:["black",2]}, 
    }
    if (material != 'air'){
    const Layer = sketch.polyface(
      [cavity+width, -padding_top],
      [cavity, -padding_top],
      [cavity, -height+padding_bottom],
      [cavity+width, -height+padding_bottom],
    )
     .stroke(...Style[material].stroke)
     .hatch(...Style[material].hatch)
      sketches.push(Layer);
   }

    if(datum){
      const Offset ={
        top:-datum.offset, 
        bottom:datum.offset+height, 
        middle:height/2-datum.offset
      }
      const Datumline =sketch.new.polycurve(
      [0, 0],
      [cavity+width, 0],
    ).offset(-Offset[datum.side]).stroke("black", 2).linestyle(15, 2,2,5).name("datum").z(99)
      const Text = sketch.new.text("0.00", Datumline.vertices[0]).translate(12,8).z(99)
      sketches.push(Datumline, Text)
    }
    return sketch.add(...sketches);
  }
}