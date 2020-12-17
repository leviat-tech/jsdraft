# JSDraft

JSDraft is a parametric functional drawing library adapted from Draft.

There are two core constructs in JSDraft: *drawings* and *draft functions*.  A *drawing* is a data structure that
stores 2d geometry and details about how render that geometry to an image.  A *draft function* is a function that
operates on a drawing to draw shapes and modify the geometry of drawing.  A draft function is called on a drawing
and always returns a modified copy of the original drawing, it never mutates the drawing directly.  After a drawing is completed it can passed to a *render function* to output an image in various formats.


## Basic Drawing
For example the code below creates a blank drawing, and chains 3 line functions together to draw a triangle.  Each
call to line returns a new drawing with an additional line drawn.  The final call to stroke returns a new drawing
with the triangle "stroked" with a thin red pen.  The render function then outputs the drawing to an svg image.
```js
const example = new Drawing()
  .line(0, 0, 0, 1)
  .line(0, 1, 1, 1)
  .line(1, 1, 0, 0)
  .stroke(1, 'red');
render(example, 'svg', {path: 'triangle.svg'})
```


## Creating a Draft Function
We can also create a custom draft function to draw this same triangle if we wanted to re-use this code:
```js
function triangle(drawing) {
  return drawing
    .line(0, 0, 0, 1)
    .line(0, 1, 1, 1)
    .line(1, 1, 0, 0)
    .stroke(1, 'red');
}

const example = triangle(new Drawing());
render(example, 'svg', {path: 'triangle.svg'})
```


## Registering a Draft Function
Custom draft functions can also be registered on the drawing class or object for repeated use:
```js
function triangle(drawing) {
  return drawing
    .line(0, 0, 0, 1)
    .line(0, 1, 1, 1)
    .line(1, 1, 0, 0)
    .stroke(1, 'red');
}

Drawing.register(triangle)
const example = new Drawing().triangle();
render(example, 'svg', {path: 'triangle.svg'})
```


## Making a Parametric Draft Function
Draft functions can also take parameters to make drawings parametric:
```js
function triangle(drawing, size, color) {
  return drawing
    .line(0, 0, 0, size)
    .line(0, size, size, size)
    .line(size, size, 0, 0)
    .stroke(1, color);
}

Drawing.register(triangle)
const example = new Drawing().triangle(2, 'blue');
render(example, 'svg', {path: 'triangle.svg'})
```


## Stand Alone Usage
You can also save your draft function as an independent file and render if from the command line:
```js
// file: triangle.draft.js

function triangle(drawing, size, color) {
  return drawing
    .line(0, 0, 0, size)
    .line(0, size, size, size)
    .line(size, size, 0, 0)
    .stroke(1, color);
}
```

To render this from the command line type:
```bash
./render.js svg triangle.svg triangle.draft.js 2 'blue'
```

## Alternate Formats
Draft functions can also be described using alterate syntax such as YAML or JSON:

```yaml
#triangle.draft.yaml

parameters:
  - size
  - color
draft:
  - line: [0, 0, 0, size]
  - line: [0, size, size, size]
  - line: [size, size, 0, 0]
  - stroke: [1, color]
```
