return {
  parameters: [
    {name: "width", default: 1000},
    { name: "layers", default: [
      {height: 50,  cavity:200, material:"concrete", width: 100, padding_bottom: -75},
      {height: 50,  cavity:300, material:"wood"},
      {height: 25,  cavity:200, material:"air"},
      {height: 150,  cavity:200, datum: {side:"top", offset:10}, material:"concrete"},
      {height: 100,  cavity:250, width: 200, material:"steel", padding_top: -50}
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