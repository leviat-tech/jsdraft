function wp(sketch) {
  const main = sketch.user.main();

  const sideLip = sketch.user.lip(10, 60, 30);
  const sideLipSnapped = sideLip.snap(main.edge(0), sideLip.edge(3).reverse());

  const bottomLip = sketch.user.lip(10, 60, 30);
  const bottomLipSnapped = bottomLip.snap(main.edge(1).reverse(), bottomLip.edge(3).reverse(), 0, true);


  const halfPill = sketch.user.halfpill(15, 30);
  const halfPillSnapped = halfPill.snap(main.edge(0).reverse(), halfPill.edge(4), 15);


  pillVoid = sketch.user.pillvoid(20, 40, 15)
    .orient([0, 0], [1, 0], main.edge(4).vertices[0], main.edge(4).vertices[1]);


  const webPlate = main.union(sideLipSnapped).union(bottomLipSnapped).subtract(halfPillSnapped).subtract(pillVoid)

  return sketch.add(main, sideLipSnapped, bottomLipSnapped, halfPillSnapped, pillVoid);
//   return sketch.add(webPlate)
}
