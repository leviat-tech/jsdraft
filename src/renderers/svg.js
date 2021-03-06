const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { createSVGWindow } = require('svgdom');


const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_STROKE = 'rgba(0,0,0,1)';
const DEFAULT_FILL = 'rgba(255,255,255,1)';


function recurse(canvas, sketch, style) {
  // set style
  const s = { ...sketch.node.style, ...style };

  // draw entities
  for (const entity of sketch.node.entities) {
    canvas.svg(entity.svg({
      stroke: s.stroke?.color || DEFAULT_STROKE,
      strokeWidth: s.stroke?.width || DEFAULT_STROKE_WIDTH,
      fill: s.fill || DEFAULT_FILL,
    }));
  }

  // draw children
  for (const child of sketch.node.children) {
    recurse(canvas, child, s);
  }
}

function render(sketch, options) {
  // create document
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // create canvas
  const canvas = SVG(document.documentElement);

  // render recursively
  recurse(canvas, sketch);

  // spit out svg
  if (options.file) {
    fs.writeFileSync(options.file, canvas.svg());
  } else {
    console.log(canvas.svg());
  }
}


module.exports = render;
