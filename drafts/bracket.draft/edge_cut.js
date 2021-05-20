function cut(
  sketch,
  side = 'left',
  B = 20,
  L = 10,
  position = 'back',
) {
  const edge = position === 'back'
    ? sketch.hidden.find(side).show().edge(0).reverse()
    : sketch.hidden.find(side).show().edge(0);
  const flip = side === 'right';
  const rect = sketch.new.rectangle(0, 0, L, B);
  const cutout = rect.snap(
    edge,
    rect.edge(0),
    0,
    position === 'back' ? flip : !flip,
  );
  return sketch.subtract(cutout);
}
