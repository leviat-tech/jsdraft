function foo(sketch) {
  const circle = sketch.circle([0, 0], 5);

  return circle.xref.test2.rectangle();
}
