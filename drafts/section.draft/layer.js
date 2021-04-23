return {
  parameters: [
    { name: "height", default: 100 },
    { name: "width", default: 100 },
    { name: "cavity", default: 30 },
    { name: "datum", default: null },
    { name: "material", default: "wood" },
  ],
  func: function (sketch, height, width, cavity, datum, material) {
    const Colormap={wood: "yellow", steel:"blue", concrete:"grey", air: "transparent"}
    const Layer = sketch.polycurve(
      [cavity+width, 0],
      [cavity, 0],
      [cavity, -height],
      [cavity+width, -height],
    ).fill(Colormap[material]).stroke("transparent", 0)
    
    sketch.add(Layer);
    
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