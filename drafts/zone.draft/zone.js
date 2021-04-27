return {
  parameters: [
    {name: "segments", default: [{length:100, angle:0}, {length:50, angle:20}, {length:50, angle:0}]},
  ],
  func: function (sketch, segments) {
    const sketches = [];
    let angle = 0;
    let end =[0,0];
    segments.forEach((segment, i) =>{
      angle+=segment.angle;
      const Segment = sketch.user.segment(segment.length).rotate(angle).translate(...end)
      end = [end[0]+segment.length*Math.cos(angle), end[1]+segment.length*Math.sin(angle)]
      sketches.push(Segment);
    })
    return sketch.add(...sketches);
  }
}