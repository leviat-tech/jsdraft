return {
  parameters: [
    { name: "items", default: [] },
  ],
  func: function (sketch, items) {
    items.forEach(item =>{
      if(item.flip)
      {
        const dim = sketch.aligned_dim(item.segment.vertices[1], item.segment.vertices[0], "right");
        sketch.add(dim);
      }
      else
      {
        const dim = sketch.aligned_dim(item.segment.vertices[0], item.segment.vertices[1]);
        sketch.add(dim)
      }
    })
    return sketch;
  }
}
