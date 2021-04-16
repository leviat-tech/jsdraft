return {
  parameters: [
    { name: "k1", default: 100 },
    { name: "i1", default: 100 },
    { name: "k2", default: 50 },
    { name: "i2", default: 60 },
    { name: "side", default: true },
  ],
  func: function wp(sketch, k1, i1, k2, i2, side) {
  const main = sketch.user.main(k1,i1,k2,i2,0);
  
  const hole = sketch.circle(main.offset(-10).vertices[3], 5);
    
  const sideLip = sketch.user.lip(10, 60, 30);
  const sideLipSnapped = sideLip.snap(main.edge(0), sideLip.edge(0));

  const bottomLip = sketch.user.lip(10, 60, 40);
  const bottomLipSnapped = bottomLip.snap(main.edge(1).reverse(), bottomLip.edge(0), 0, true);

  const halfPill = sketch.user.halfpill(15, 30);
  const halfPillSnapped = halfPill.snap(main.edge(0).reverse(), halfPill.edge(4), 15, false);

  const pillVoid = sketch.user.pillvoid(30, 50, 20)
    .orient([0, 0], [1, 0], main.edge(3).vertices[0], main.edge(3).vertices[1]);

  const leg = sketch.rectangle(bottomLip.edge(2).length,30,0,0);
  const legSnapped = leg.snap(bottomLipSnapped.edge(2), leg.edge(0), 0)

  const toe = sketch.rectangle(20,10,0,0);
  const toeSnapped = toe.snap(legSnapped.edge(2), toe.edge(0), 0, true)

  const neck = sketch.rectangle(main.edge(3).length, 30,0,0);
  const neckSnapped = neck.snap(main.edge(3), leg.edge(0), 0)

 
  let webPlate = main
  if (side)
   webPlate = main.union(sideLipSnapped)

//   .union(bottomLipSnapped).subtract(halfPillSnapped).subtract(pillVoid)

  return sketch.add(main, sideLipSnapped, bottomLipSnapped,legSnapped, toeSnapped, halfPillSnapped, pillVoid, hole, main.edge(3), neckSnapped);
//   return sketch.add(webPlate)
}
}

