return {
  parameters: [
    {name: "segments", default: [{length:100, angle:0}, {length:75, angle:-20}, {length:50, angle:20}]},
  ],
  func: function (sketch, segments) {
    const sketches = [];
    let angle = 0;
    let next ={x:0,y:0};
    segments.forEach((segment, i) =>{
      angle+=segment.angle;
      const Segment = sketch.user.segment(segment.length).rotate(angle).translate(next.x,next.y);
      next = Segment.find("edge").vertices[1]
      sketches.push(Segment);
    })
    return sketch.add(...sketches);
  }
}