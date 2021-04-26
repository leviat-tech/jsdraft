return {
  parameters: [
    { name: "height", default: 100 },
    { name: "width", default: 100 },
    { name: "cavity", default: 30 },
    { name: "datum", default: null },
    { name: "material", default: "wood" },
    { name: "infinite", default: true },
    { name: "padding_bottom", default: 0 },
    { name: "padding_top", default: 0 },
  ],
  func: function (sketch, height, width, cavity, datum, material, infinite, padding_bottom, padding_top) {
    const Style={
      wood: {fill:"yellow", stroke:["black",.5]}, 
      steel:{fill:"blue", stroke:["black",1]}, 
      concrete:{fill:"grey", stroke:["black",2]}, 
      air: {fill:"transparent", stroke:["transparent",0]}
    }
    if(infinite)
    {
      const Layer = sketch.polycurve(
      [cavity+width, -padding_top],
      [cavity, -padding_top],
      [cavity, -height+padding_bottom],
      [cavity+width, -height+padding_bottom],
    ).fill(Style[material].fill)
     .stroke(...Style[material].stroke)
    sketch.add(Layer);
    }
    else
    {
       const Layer = sketch.polycurve(
      [cavity+width, -padding_top],
      [cavity, -padding_top],
      [cavity, -height+padding_bottom],
      [cavity+width, -height+padding_bottom],
      [cavity+width, -padding_top],
    ).fill(Style[material].fill)
     .stroke(...Style[material].stroke)
    sketch.add(Layer);
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
    ).offset(-Offset[datum.side]).stroke("red", 2)
      const Text = sketch.new.text("0.00", Datumline.vertices[0]).translate(12,8)
      sketch.add(Datumline, Text)
    }
    return sketch;
  }
}