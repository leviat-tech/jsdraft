return {
  parameters: [
    { name: "height", default: 100 },
    { name: "length", default: 100 },
    { name: "cavity", default: 30 },
    { name: "datum", default: {side:"middle", offset:0} },
    { name: "material", default: "wood" },
  ],
  func: function (sketch, height, length, cavity, datum, material) {
    const Colormap={wood: "yellow", steel:"blue", concrete:"grey"}
    const Layer = sketch.polycurve(
      [cavity+length, 0],
      [cavity, 0],
      [cavity, -height],
      [cavity+length, -height],
    ).fill(Colormap[material])
    
    sketch.add(Layer);
    
    if(datum){
      const Offset ={
        top:-datum.offset, 
        bottom:datum.offset+height, 
        middle:height/2-datum.offset
      }
      const Datumline =sketch.new.polycurve(
      [0, 0],
      [cavity+length, 0],
    ).offset(-Offset[datum.side]).stroke("red", 2)
      const Text = sketch.new.text("0.00", Datumline.vertices[0]).translate(12,8)
      sketch.add(Datumline, Text)
    }
    return sketch;
  }
}