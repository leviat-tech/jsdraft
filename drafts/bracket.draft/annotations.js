return {
  parameters: [
    { name: "items", default: [] },
  ],
  func: function (sketch, items) {
    const sketches =[];
    items.forEach(item =>{
      if(item.flip)
      {
        const dim = sketch.aligned_dim(item.segment.vertices[1], item.segment.vertices[0], "right");
        sketches.push(dim);
      }
      else
      {
        const dim = sketch.aligned_dim(item.segment.vertices[0], item.segment.vertices[1]);
        sketches.push(dim)
      }
    })
    return sketch.add(...sketches);
  }
}
