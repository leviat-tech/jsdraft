const fs = require('fs');
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { createSVGWindow } = require('svgdom');


function recurse(canvas, sketch, style) {
  // set style
  const s = {...sketch.node.style, ...style};

  // draw entities
  for (const entity of sketch.node.entities) {
    canvas.svg(entity.svg({stroke: s.stroke?.color, strokeWidth: s.stroke?.width, fill:s.fill}))
  }

  // draw children
  for (const child of sketch.node.children) {
    recurse(canvas, child, s);
  }
}

module.exports = function render(sketch, options) {
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
    fs.writeFileSync(options.file, canvas.svg())
  } else {
    console.log(canvas.svg());
  }
}
