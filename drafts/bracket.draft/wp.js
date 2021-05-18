return {
  parameters: [
    { name: "params" , default: {
      k1: 100 ,
      i1: 100 ,
      k2: 50 ,
      i2: 60 ,
      radius: 10 ,
      hole: {r:5, offset: 10} ,
      halfpill: {h:20, w: 40, bottom: 15} ,
      void: {h: 25, w: 60, offset: 20},
      side_lip: {h: 10, bw:50, tw:30} ,
      bottom_lip: {h: 10, bw:70, tw:50} ,
      leg: {h: 30, gap: 10, r: 5} ,
      toe: {h: 30, gap: 20, r: 5} ,
      neck: {h: 30, gap: 20, r: 10} ,
      }
    }
  ],
  func: function wp(sketch, params) {
  const Main = sketch.user.main(params.k1,params.i1,params.k2,params.i2,0);
  const toAdd = [];
  const toRemove = [];
  
  if (params.hole)
  {
    const Hole = sketch.circle(Main.offset(-params.hole.offset).vertices[3], params.hole.r);
    toRemove.push(Hole);
  }
  
  if (params.side_lip)
  {
    const SideLip = sketch.user.lip(params.side_lip.h, params.side_lip.bw, params.side_lip.tw);
    const SideLipSnapped = SideLip.snap(Main.edge(0), SideLip.edge(0));
    toAdd.push(SideLipSnapped);
  }

  if (params.bottom_lip)
  {
    const BottomLip = sketch.user.lip(params.bottom_lip.h, params.bottom_lip.bw, params.bottom_lip.tw);
    const BottomLipSnapped = BottomLip.snap(Main.edge(1).reverse(), BottomLip.edge(0), 0, true);
    toAdd.push(BottomLipSnapped);

    if ( params.leg)
    {
        const Leg= sketch.user.extrusion(BottomLip.edge(2).length - params.leg.gap,params.leg.h,params.leg.r);
        const LegSnapped = Leg.snap(BottomLipSnapped.edge(2).reverse(), Leg.edge(0), 0, true);
        toAdd.push(LegSnapped)

        if (params.toe)
        {
        const Toe = sketch.user.extrusion(Leg.edge(-2).length- params.toe.gap, params.toe.h,params.toe.r);
        const ToeSnapped = Toe.snap(LegSnapped.edge(-2).reverse(), Toe.edge(0), 0, true);
        toAdd.push(ToeSnapped)
        }
    }

  }

  if (params.halfpill)
  {
    const HalfPill = sketch.user.halfpill(params.halfpill.h, params.halfpill.w);
    const HalfPillSnapped = HalfPill.snap(Main.edge(0).reverse(), HalfPill.edge(4), params.halfpill.bottom, false);
    toRemove.push(HalfPillSnapped);
  }

  if(params.void)
  {
    const PillVoid = sketch.user.pillvoid(params.void.h, params.void.w, params.void.offset)
    .orient([0, 0], [1, 0], Main.edge(3).vertices[0], Main.edge(3).vertices[1]);
    toRemove.push(PillVoid);
  }


if (params.neck)
{
  const Neck = sketch.user.extrusion(Main.edge(-1).length - params.neck.gap, params.neck.h,params.neck.r);
  const NeckSnapped = Neck.snap(Main.edge(-1), Neck.edge(0), 0);
  toAdd.push(NeckSnapped);
}
  

//   const annotations = sketch.user.annotations([
//     {segment: Main.edge(-1), flip: false}, 
//     {segment: Main.edge(0), flip: false}, 
//     {segment: PillVoid.edge(1), flip: false}, 
//     {segment: ToeSnapped.edge(3), flip: true}
//   ]);

  let WebPlate = Main.fillet(params.radius, 2)
  .union(...toAdd);

  toRemove.forEach( shape => WebPlate = WebPlate.subtract(shape));

  return sketch.add(WebPlate)
}
}

