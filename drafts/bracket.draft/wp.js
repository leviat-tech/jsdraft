return {
  parameters: [
    { name: "k1", default: 100 },
    { name: "i1", default: 100 },
    { name: "k2", default: 50 },
    { name: "i2", default: 60 },
    { name: "radius", default: 10 },
    { name: "side_lip", default: {h: 10, bw:50, tw:30} },
    { name: "bottom_lip", default: {h: 10, bw:70, tw:50} },
    { name: "leg", default: {h: 30, gap: 10, r: 5} },
    { name: "toe", default: {h: 30, gap: 20, r: 5} },
    { name: "neck", default: {h: 30, gap: 20, r: 10} },
  ],
  func: function wp(sketch, k1, i1, k2, i2, radius, side_lip, bottom_lip, leg, toe, neck) {
  const Main = sketch.user.main(k1,i1,k2,i2,0);
  
  const Hole = sketch.circle(Main.offset(-10).vertices[3], 5);
    
  const SideLip = sketch.user.lip(side_lip.h, side_lip.bw, side_lip.tw);
  const SideLipSnapped = SideLip.snap(Main.edge(0), SideLip.edge(0));

  const BottomLip = sketch.user.lip(bottom_lip.h, bottom_lip.bw, bottom_lip.tw);
  const BottomLipSnapped = BottomLip.snap(Main.edge(1).reverse(), BottomLip.edge(0), 0, true);

  const HalfPill = sketch.user.halfpill(15, 30);
  const HalfPillSnapped = HalfPill.snap(Main.edge(0).reverse(), HalfPill.edge(4), 15, false);

  const PillVoid = sketch.user.pillvoid(30, 50, 20)
    .orient([0, 0], [1, 0], Main.edge(3).vertices[0], Main.edge(3).vertices[1]);

  const Leg= sketch.user.extrusion(BottomLip.edge(2).length - leg.gap,leg.h,leg.r);
  const LegSnapped = Leg.snap(BottomLipSnapped.edge(2).reverse(), Leg.edge(0), 0, true);

  const Toe = sketch.user.extrusion(Leg.edge(-2).length- toe.gap, toe.h,toe.r);
  const ToeSnapped = Toe.snap(LegSnapped.edge(-2).reverse(), Toe.edge(0), 0, true)

  const Neck = sketch.user.extrusion(Main.edge(-1).length - neck.gap, neck.h,neck.r);
  const NeckSnapped = Neck.snap(Main.edge(-1), Neck.edge(0), 0)
  
//   const annotations = sketch.user.annotations([
//     {segment: Main.edge(-1), flip: false}, 
//     {segment: Main.edge(0), flip: false}, 
//     {segment: PillVoid.edge(1), flip: false}, 
//     {segment: ToeSnapped.edge(3), flip: true}
//   ]);

   const WebPlate = Main.fillet(radius, 2).union(BottomLipSnapped)
   .union(LegSnapped)
   .union(ToeSnapped)
   .subtract(Hole)
   .subtract(PillVoid)
//    .union(SideLipSnapped)
//    .union(NeckSnapped)
//    .subtract(HalfPillSnapped)


//   return sketch.add(Main, SideLipSnapped, BottomLipSnapped, LegSnapped, ToeSnapped, HalfPillSnapped, PillVoid, Hole, NeckSnapped);
  return sketch.add(WebPlate)
}
}

