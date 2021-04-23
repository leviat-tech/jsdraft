return {
  parameters: [
    { name: "layers", default: [{height: 10, length: 100, cavity:30, datum:{side:"top", offset:5}, material:"wood"}] },
  ],
  func: function (sketch, layers) {
    layers.forEach(layer =>{
      const Layer = sketch.user.layer(
        layer.height, 
        layer.length, 
        layer.cavity, 
        layer.datum, 
        layer.material);
      
      sketch.add(Layer);
    })
    return sketch;
  }
}