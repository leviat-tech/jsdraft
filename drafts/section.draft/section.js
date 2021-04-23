return {
  parameters: [
    {name: "width", default: 100},
    { name: "layers", default: [
      {height: 10,  cavity:30, material:"wood"},
      {height: 30,  cavity:40, datum: {side:"top", offset:5}, material:"concrete"},
      {height: 10,  cavity:50, material:"steel"}
    ] },
  ],
  func: function (sketch, width, layers) {
    let Stackheight = 0;
    layers.forEach(layer =>{
      const Layer = sketch.user.layer(
        layer.height, 
        width-layer.cavity, 
        layer.cavity, 
        layer.datum, 
        layer.material).translate(0,-Stackheight)
      Stackheight+=layer.height;
      sketch.add(Layer);
    })
    return sketch;
  }
}