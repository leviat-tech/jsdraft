// utility function to remove quotes from JSON representation
function u(o) {
  const json = JSON.stringify(o, null, 1);
  return json.replace(/"([^"]+)":/g, '$1:').replace(/\n/g, '');
}

function format(o) {
  if (Array.isArray(o)) {
    return o.map((i) => format(i));
  }

  if (typeof o === 'object' && o !== null) {
    const obj = Object.entries(o).reduce((p, [k, v]) => {
      p[k] = format(v);
      return p;
    }, {});

    return u(obj);
  }

  if (!Number.isNaN(o)) return parseFloat(o.toFixed(5), 10);

  return o;
}

function f(o) {
  return Object.entries(o).reduce((obj, [k, v]) => {
    obj[k] = format(v);
    return obj;
  }, {});
}

const entities = {
  Point: (e) => f({
    x: e.x,
    y: e.y,
  }),
  Segment: (e) => f({
    ps: { x: e.ps.x, y: e.ps.y },
    pe: { x: e.pe.x, y: e.pe.y },
  }),
  Arc: (e) => f({
    pc: { x: e.pc.x, y: e.pc.y },
    r: e.r,
    start: { x: e.start.x, y: e.start.y },
    end: { x: e.end.x, y: e.end.y },
    startAngle: e.startAngle,
    endAngle: e.endAngle,
    counterClockwise: e.counterClockwise,
  }),
  Circle: (e) => f({
    pc: { x: e.center.x, y: e.center.y },
    r: e.radius,
  }),
  Rectangle: (e) => f({
    xmin: e.xmin,
    xmax: e.xmax,
    ymin: e.ymin,
    ymax: e.ymax,
    r: e.r,
  }),
  Polycurve: (e) => f({
    vertices: e.vertices.map((v) => ({ x: v.x, y: v.y })),
  }),
  Polyface: (e) => f({
    vertices: e.vertices.map((v) => ({ x: v.x, y: v.y })),
  }),
  AlignedDim: (e) => f({
    ps: { x: e.ps.x, y: e.ps.y },
    pe: { x: e.pe.x, y: e.pe.y },
    side: e.side,
  }),
  Text: (e) => f({
    p: { x: e.p.x, y: e.p.y },
    text: e.text,
    rotation: e.rotation,
  }),
};

export default entities;
