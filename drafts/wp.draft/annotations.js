return {
  parameters: [
    { name: "segments", default: [] },
  ],
  func: function (sketch, segments) {
    segments.forEach(segment =>{
      const dim = sketch.aligned_dim(segment.vertices[0], segment.vertices[1]);
      sketch.add(dim);
    })
    return sketch;
    
  }
}
