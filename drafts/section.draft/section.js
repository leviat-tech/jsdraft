return {
  parameters: [
    {name: "width", default: 200},
    { name: "layers", default: [
      {height: 10,  cavity:40, material:"concrete", width: 20, padding_bottom: -15},
      {height: 10,  cavity:60, material:"wood"},
      {height: 5,  cavity:40, material:"air"},
      {height: 30,  cavity:40, datum: {side:"top", offset:5}, material:"concrete"},
      {height: 20,  cavity:50, width: 40, material:"steel", padding_top: -5}
    ] },
  ],
  func: function (sketch, width, layers) {
    let Stackheight = 0;
    layers.forEach(layer =>{
      const Layer = sketch.user.layer(
        layer.height, 
        layer.width ? layer.width : width-layer.cavity, 
        layer.cavity, 
        layer.datum, 
        layer.material,
        layer.width && false,
        layer.padding_bottom,
        layer.padding_top
      ).translate(0,-Stackheight)
      Stackheight+=layer.height;
      sketch.add(Layer);
    })
//     const Masonry = sketch.user.masonry();
    return sketch;
  }
}