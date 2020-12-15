import { SVG, registerWindow } from '@svgdotjs/svg.js';
import { createSVGWindow } from 'svgdom';


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

export default function render(c) {
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
