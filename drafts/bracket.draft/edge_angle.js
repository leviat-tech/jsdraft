function angle(
  sketch,
  side = 'left',
  params = {
    height: 40,
    width: 75,
    length: 50,
    thickness: 5,
    radius: 8,
  },
) {
  const flip = side !== 'left';
  const angle = sketch.new.user.angle_top({
    ...params,
    length: params.length + params.thickness,
  });
  const source = side === 'left'
    ? sketch.hidden.find('top').show().edge(0)
    : sketch.hidden.find('top').show().edge(0).reverse();
  const angleSnapped = angle
    .snap(
      source,
      angle.hidden.find('right').show().edge(0),
      0,
      flip,
    )
    .translate(0, -params.thickness)
    .prune('left', 'right', 'top');

  return sketch.add(angleSnapped);
}
