function cut(
  sketch,
  side = 'left',
  params = {
    B: 20,
    L: 10,
    side: 'back',
  },
) {
  const edge = params.side === 'back'
    ? sketch.hidden.find(side).show().edge(0).reverse()
    : sketch.hidden.find(side).show().edge(0);
  const flip = side === 'right';
  const rect = sketch.new.rectangle(0, 0, params.L, params.B);
  const cutout = rect.snap(
    edge,
    rect.edge(0),
    0,
    params.side === 'back' ? flip : !flip,
  );
  return sketch.subtract(cutout);
}
