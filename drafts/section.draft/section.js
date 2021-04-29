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
    { name: "masonry", default: {
      drop: 300 ,
      thickness: 112.5,
      material: "brick",
      mortar: 10}
    }
  ],
  func: function (sketch, width, layers, masonry) {
    const sketches =[];
    let Datum = {x:0, y:0};
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
      
      if (layer.datum){
        Datum = Layer.find("datum").vertices[0]
      }
      Stackheight+=layer.height;
      sketches.push(Layer);
    })
    const Masonry = sketch.user.masonry(masonry.drop-Datum.y).translate(0,Datum.y-masonry.drop);
    sketches.push(Masonry);
    return sketch.add(...sketches).translate(0,-Datum.y);
  }
}