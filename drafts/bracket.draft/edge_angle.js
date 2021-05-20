function angle(sketch, side = 'left', params = {}) {
  const flip = side !== 'left';
  const origSketch = sketch;
  const angle = sketch.new.user.angle_top({ ...params, width: params.width + params.thickness });
  const source = side === 'left' ? origSketch.hidden.find('top').show().edge(0) : origSketch.hidden.find('top').show().edge(0).reverse();
  const angleSnapped = angle.snap(
    source,
    angle.hidden.find('right').show().edge(0),
    0, flip,
  ).translate(0, -params.thickness);

  return origSketch.add(angleSnapped);
}
