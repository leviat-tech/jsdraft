const { SVG, registerWindow } = require('@svgdotjs/svg.js');
const { createSVGWindow } = require('svgdom');


function recurse(canvas, definition, stroke) {
  // set brush
  const s = definition.stroke ?? stroke;

  // draw shapes
  for (const l of definition.lines) {
    canvas.line(l[0][0], l[0][1], l[1][0], l[1][1]).stroke(s);
  }

  // draw groups
  for (const g of definition.groups) {
    recurse(canvas, g, s);
  }
}

module.exports = function render(c) {
  // create document
  const window = createSVGWindow();
  const document = window.document;
  registerWindow(window, document);

  // create canvas
  const canvas = SVG(document.documentElement);

  // render recursively
  recurse(canvas, c.definition);

  // spit out svg
  console.log(canvas.svg());
}
