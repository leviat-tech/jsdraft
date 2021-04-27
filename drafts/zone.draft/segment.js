return {
  parameters: [
    {name: "length", default: 100},
    {name: "assemblies", default: [{length: 30, position: 0}, {length: 30, position: 32}]},
    {name: "color", default: "red"},
  ],
  
  func: function (sketch, length, assemblies, color) {
    const sketches =[];
    const EdgeHatch = sketch.rectangle(0,6,length,20)
    .fill(color)
    .stroke("transparent",0);
    const Edge = sketch.polycurve(
    [0,6],[length,6]);
    sketches.push(EdgeHatch);
    sketches.push(Edge);
    
    if(assemblies.length > 0){
       assemblies.forEach(assembly =>{
       const Assembly = sketch.rectangle(assembly.position,0,assembly.position+assembly.length, 5);
       sketches.push(Assembly);
      })
    }
    else{
    const Placeholder = sketch.rectangle(0,0,length,5)
    .fill("transparent")
    sketches.push(Placeholder);
    }
    return sketch.add(...sketches);
  }
}
