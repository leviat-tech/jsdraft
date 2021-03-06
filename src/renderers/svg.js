const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_STROKE = 'rgba(0,0,0,1)';
const DEFAULT_FILL = 'rgba(255,255,255,1)';


function recurse(svg, sketch, style) {
  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  for (const entity of sketch.node.entities) {
    svg += entity.svg({
      stroke: s.stroke?.color || DEFAULT_STROKE,
      strokeWidth: s.stroke?.width || DEFAULT_STROKE_WIDTH,
      fill: s.fill || DEFAULT_FILL,
    });
  }

  // draw children
  for (const child of sketch.node.children) {
    svg += recurse(svg, child, s);
  }

  return svg;
}

function render(sketch) {
  return `<svg>${recurse('', sketch)}</svg>`;
}


module.exports = render;
