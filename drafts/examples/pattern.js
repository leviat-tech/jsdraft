function pattern(sketch) {
  return sketch
    .circle([0, 0], 10)
    .rectangle([0, 0], 10, 10)
    .fill('url(#hatch)');
}
