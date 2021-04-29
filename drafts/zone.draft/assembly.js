return {
  parameters: [
    {name: "length", default: 100},
    {name: "width", default: 10},
    {name: "left", default: {type: "cut"}},
    {name: "right", default: null},
  ],
  
  func: function (sketch, length, width, left, right) {
    const sketches =[];
    const Modifiers = {
        cut: (base, side, params)=>{
        const Flip = {right: -1, left: 1};
        const Left = base.hidden.find("left");
        const Right = base.hidden.find("right");
        const Edge = base.hidden.find(side);
        const FarEdge= Edge.offset(Flip[side]*10);
        const Triangle = sketch.polyface(
          ...Edge.vertices,
          FarEdge.vertices[0]
        )
        const Union = base.union(Triangle);
        return sketch.new.add(Union, Left.hide().name("left"), Right.hide().name("right"));
      }
    };
    const Rect = sketch.rectangle(0,0,length, width);
    const Left = sketch.polycurve([0,0],[0,width]).hide().name("left");
    const Right = sketch.polycurve([length,0],[length,width]).hide().name("right");
    
    let Assembly = sketch.new.add(Rect, Left, Right);
    
    if(left)
    {Assembly = Modifiers[left.type](Assembly, "left",left);}
    if(right)
    {
//     Assembly = Modifiers[right.type](Assembly, "right",right);
    }

    sketches.push(Assembly);
    
    return sketch.add(...sketches);
  }
}
