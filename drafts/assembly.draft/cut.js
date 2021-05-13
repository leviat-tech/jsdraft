function miter(sketch, side = 'left', L=5, B=2, position = 'front') {
  const dir = side === 'left'? false : true;
  
  const edge = position === 'back' ? sketch.edge(0).reverse() : sketch.edge(0);
  
  const rect = sketch.new.rectangle(0,0,L,B)
  const cutout = rect.snap(edge, rect.edge(0), 0, position === 'back' ? dir : !dir);
  return sketch.add(cutout);
}
