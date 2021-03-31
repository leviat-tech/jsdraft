const entities = {
  Point: (e) => ({
    x: e.x,
    y: e.y,
  }),
  Segment: (e) => ({
    ps: { x: e.ps.x, y: e.ps.y },
    pe: { x: e.pe.x, y: e.pe.y },
  }),
  Arc: (e) => ({
    pc: { x: e.pc.x, y: e.pc.y },
    r: e.r,
    start: { x: e.start.x, y: e.start.y },
    end: { x: e.end.x, y: e.end.y },
    startAngle: e.startAngle,
    endAngle: e.endAngle,
    counterClockwise: e.counterClockwise,
  }),
  Circle: (e) => ({
    pc: { x: e.center.x, y: e.center.y },
    r: e.radius,
  }),
  Rectangle: (e) => ({
    xmin: e.xmin,
    xmax: e.xmax,
    ymin: e.ymin,
    ymax: e.ymax,
    r: e.r,
  }),
  Polycurve: (e) => ({
    vertices: e.vertices.map((v) => ({ x: v.x, y: v.y })),
  }),
  Polyface: (e) => ({
    vertices: e.vertices.map((v) => ({ x: v.x, y: v.y })),
  }),
  AlignedDim: (e) => ({
    ps: { x: e.ps.x, y: e.ps.y },
    pe: { x: e.pe.x, y: e.pe.y },
    side: e.side,
  }),
  Text: (e) => ({
    p: { x: e.p.x, y: e.p.y },
    text: e.text,
    rotation: e.rotation,
  }),
};

export default entities;
