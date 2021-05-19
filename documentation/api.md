# JSDraft API

Table of Contents:

* [Sketch features](#sketch-features)
  * [Geometric features](#geometric-features)
    * [point](#point-x-y-)
    * [segment](#segment-point-point-)
    * [arc](#arc-point-number-number-number-boolean-)
    * [polycurve](#polycurve-value-value-value--value-)
    * [polyface](#polyface-value-value-value-value--value-)
    * [rectangle](#rectangle-number-number-number-number-number-)
    * [circle](#circle-point-number-)
  * [Annotations](#annotations)
    * [text](#text-string-point-number-)
    * [aligned_dim](#aligned_dim-point-point-string-)
    * [dim_string](#dim_string-point-point-array-)
    * [angle_dim](#angle_dim-point-point-number-)
  * [Operations](#operations)
    * [add_faces](#add_faces-sketch-)
    * [close](#close-number-)
    * [explode](#explode)
    * [fillet](#fillet-number-number-)
    * [interpolate](#interpolate-point-point-array-)
    * [join](#join)
    * [offset](#offset-number-boolean-)
    * [prune](#prune-condition-condition-)
    * [subtract](#subtract-sketch-)
    * [union](#union-sketch-)
  * [Transformations](#transformations)
    * [orient](#orient-point-point-point-point-)
    * [snap](#snap-segment-segment-number-boolean-)
    * [rotate](#rotate-number-string-)
    * [scale](#scale-number-number-)
    * [translate](#translate-number-number-)
  * [Style features](#style-features)
    * [fill](#fill-string-)
    * [hatch](#hatch-string-number-number-string-string-)
    * [linestyle](#linestyle-number-number-)
    * [stroke](#stroke-string-number-)
    * [style](#style-string-)
  * [Meta features](#meta-features)
    * [hide](#hide)
    * [name](#name-string-)
    * [show](#show)
    * [tag](#tag)
    * [z](#z-number)
* [Sketch utility functions](#sketch-utility-functions)
  * [add](#add-args-)
  * [new](#new)
  * [create](#create-options-)
  * [clone](#clone)
  * [shape](#shape)
* [Sketch getters](#sketch-getters)
* [Sketch queries](#sketch-queries)
* [Entities](#entities)
* [Draft](#draft)
* [render](#render)


## Sketch features

Sketch instances have a number of built-in feature functions that can be used to add or modify entities. These can either be called on the "sketch" argument of a feature function:

```js
function my_feature(sketch) {
  return sketch.point(0, 0);
}
```

...or on an instance of the Sketch object:

```js
import { Sketch } from '@crhio/jsdraft';

const sketch = new Sketch().point(0, 0);
```

## Geometric features

### _point( x, y )_

Adds a point entity.

```js
const ptSketch = sketch.point(1, 2);
```


### _segment( point, point )_
### _segment( segment, point )_

Adds a segment to a sketch.

```js
// Construction: from two points
const ptSketch = sketch.segment(ptA, ptB);

// Construction: perpendicular to a segment
const ptSketch = sketch.segment(segment, pt);
```


### _arc( point, number, number, number[, boolean] )_
### _arc( point, number, number[, boolean] )_
### _arc( point, point, point )_
### _arc( point, number, point )_
### _arc( segment, segment, number[, boolean] )_

Adds an arc to a sketch.

```js
// Construction: center, radius, start, end, counterclockwise
const arcSketch = sketch.arc([0, 0], 20, 0, Math.PI / 2, true);

// Construction: center, start, angle, counterclockwise
const arcSketch = sketch.arc([0, 0], [10, 0], Math.PI / 2, true);

// Construction: start, through, end
const arcSketch = sketch.arc([0, 0], [5, 5], [10, 10]);

// Construction: start, bulge, end
const arcSketch = sketch.arc([0, 0], 1, [10, 10]);

// Construction: tangent segment, tangent segment, radius, counterclockwise
const arcSketch = sketch.arc([[5, 0], [0, 0]], [[0, 5], [0, 0]], 2, false)
```


### _polycurve( value, value[, value[, ...[, value]]] )_
### _polycurve( [seg[, seg[, ...[, seg]]]] )_

Adds a polycurve (an open chain of segments and arcs) to a sketch.

```js
// Construction: a series of points, bulge values, or fillet points
const polycurveSketch = sketch.polycurve(
  [0, 0],       // An array defining a point
  [3, 3],
  1,            // "bulge" values define an arc between the previous and subsequent points
  [5, 4],
  [10, 2],
  [[15, 8], 1], // An array of [point, radius] can define a vertex with a fillet
  [10, 8],
);

// Construction: a series of segments or arcs
const polycurveSketch = sketch.polycurve(
  [[0, 0], [1, 1]],
  [[1, 1], [2, 0]],
  [[2, 0], [5, 5]],
);
```


### _polyface( value, value, value[, value[, ...[, value]]] )_
### _polyface( [seg[, seg[, ...[, seg]]]] )_
### _polyface( polycurve[, bulge] )_

Adds a polyface (a closed chain of segments and arcs) to a sketch. A polyface can consist of multiple chains, which allows for the definition of void faces.

```js
// Construction: a series of point, bulge values, or fillet points
const polyfaceSketch = sketch.polyface(
  [0, 0],       // An array defining a point
  [3, 3],
  1,            // "bulge" values define an arc between the previous and subsequent points
  [5, 4],
  [10, 2],
  [[15, 8], 1], // An array of [point, radius] can define a vertex with a fillet
  [10, 8],
);

// Construction: a series of segments or arcs
const polyfaceSketch = sketch.polyface(
  [[0, 0], [1, 1]],
  [[1, 1], [2, 0]],
  [[2, 0], [5, 5]],
);

// Construction: create a polyface from a polycurve
const polyfaceSketch = sketch.polyface(
  polycurve,
  1 // An optional bulge value can be provided if the closing segment should be an arc
);
```


### _rectangle( number, number, number, number[, number] )_
### _rectangle( point, number, number[, number] )_
### _rectangle( point, point[, number] )_
### _rectangle( segment, number[, number] )_

Adds a rectangle to a sketch. A rectangle is a "polyface"--a closed chain of segments and arcs.

```js
// Construction: xmin, ymin, xmax, ymax, radius
const rectSketch = sketch.rectangle(1, 1, 11, 6, 1);

// Construction: origin, width, height, radius
const rectSketch = sketch.rectangle([1, 1], 10, 5, 1);

// Construction: corner1, corner2, radius
const rectSketch = sketch.rectangle([1, 1], [11, 6], 1);

// Construction: segment, height, radius
const rectSketch = sketch.rectangle([[1, 1], [11, 1]], 5, 1);
```


### _circle( point, number )_
### _circle( point, point )_
### _circle( point, point, point )_
### _circle( segment, segment, number )_

Adds a circle to a sketch. A circle is a "polyface"--a closed chain of segments and arcs.

```js
// Construction: center, radius
const circSketch = sketch.circle([0, 0], 5);

// Construction: center, point
const circSketch = sketch.circle([0, 0], [5, 0]);

// Construction: three points on circle
const circSketch = sketch.circle([0, 0], [5, 0], [2, 6]);

// Construction: two tangent segments and radius
const circSketch = sketch.circle(
  [[0, -10], [10, 0]],
  [[0, 10], [10, 0]],
  7
);
```


## Annotations

### _text( string, point[, number] )_

Adds a text annotation to a sketch.

```js
// Construction: text, point, rotation
const textSketch = sketch.text("Hello, world!", [0, 0], 25);
// Places the text "Hello, world!" at the sketch's origin.
```


### _aligned_dim( point, point[, string] )_

Places an aligned dimension between two points.

```js
const dimSketch = sketch.aligned_dim([0, 0], [4, 3]);
// Places an aligned dimension string traveling from the origin to [4, 3],
// with a distance label of "5".

const dimSketch = sketch.aligned_dim([0, 0], [4, 3], "right");
// Places the same aligned dimension string, but offset to the opposite side
// as in the previous example.
```


### _dim_string( point, point, array )_

Places a dimension string between two points, with ticks at intermediate distances.

```js
// Construction: start point, endpoint, ticks
const result = sketch.dim_string([0, 0], [100, 10], [20, 40, 60])
// Will result in a dimension string with four labeled dimensions: 20, 40, 60,
// and the remainder to the end of the dimension string.
```


### _angle_dim( point, point, number )_

Places an angle dimension given a center point, a point along a line, and an angle.

```js
// Construction: center, point, angle
const result = sketch.angle_dim([0, 0], [100, 0], 30);
// Will result in an angle dimension indicating 30 degrees.
```

## Operations

### _add_faces( sketch )_

Combines the faces from the supplied sketch with the polyfaces in the original sketch. Useful for creating polyfaces with voids.

```js
const circles = sketch.new
  .circle([0, 15], 5)
  .circle([-5, -5], 5);

const pfaceSketch = sketch
  .polyface(
    [-25, 0],
    [-25, 25],
    -1,
    [25, 25],
    [25, 0],
  )
  .add_faces(circles)
```


### _close( [number] )_

Closes any open polycurves in a sketch and converts to polyfaces.

```js
const sketch = sketch.polycurve([0, 0], [16, 16], [25, 0], [50, 0]).close();
// Results in a closed polyface

// if a bulge parameter is provided, the closing segment will be an arc.
const sketch = sketch.polycurve([0, 0], [16, 16], [25, 0], [50, 0]).close(1);
```


### _explode()_

Returns a new sketch with all polycurves and polyfaces converted to arcs and segments.

```js
const exploded = sketch.explode();
```


### _fillet( number[, number] )_

Any polycurves or polyfaces in the sketch will have their straight edges filleted by the provided radius.

```js
const filleted = sketch
  .polycurve([0, 0], [16, 16], [25, 0], [50, 0])
  .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
  .fillet(2);
```

Providing an index for the optional second argument will cause a single vertex to be filleted:

```js
const filleted = sketch
  .polycurve([0, 0], [16, 16], [25, 0], [50, 0])
  .fillet(2, 0);
// only the first inner vertex will be filleted.
```

### _interpolate( point, point, array )_

Interpolates a polycurve between two points. The polycurve is created by taking a polycurve, orienting it along the axis between two points, and connecting the endpoints of each polycurve into a single new polycurve.

```js
const interpolatedSketch = sketch
  .polycurve(
    [-5, 0],
    [-5, 5],
    -1,
    [5, 5],
    [5, 0],
  )
  .interpolate([0, 0], [100, 100], [20, 50, 80]);
```


### _join()_

Returns a new sketch that joins the coincident endpoints of any segments, arcs, or polycurves.

```js
const result = sketch
  .segment([0, 0], [10, 10])
  .segment([50, 50], [40, 40])
  .segment([10, 10], [20, 0])
  .polycurve(
    [-20, -20],
    [-10, 0],
    [0, 0],
  )
  .segment([-20, -20], [20, 0])
  .join();
// Results in a sketch with two entities: a polyface and a segment
```


### _offset( number[, boolean] )_

Offsets any arc, segment, polycurve, or polyface entity in the sketch by the "distance" provided.

The optional second argument determines whether the resulting offset curve will have sharp corners.

```js
const result = sketch
  .polycurve(
    [0, 0],
    1,
    [1, 1],
    -1,
    [3, 3],
  )
  .offset(0.25);
// Results in a new sketch with the offset polycurve.
```


### _prune( condition[, condition] )_

Removes any number of nodes from a sketch and returns the modified sketch.

```js
const foo = sketch
  .polycurve([0, 0], [16, 16], [25, 0], [50, 0])
  .name('foo');

const bar = sketch
  .polyface([0, 0], [16, 16], [-10, 20], [-12, 2])
  .name('bar');

const baz = sketch
  .circle([10, 10], 3)
  .name('baz');

const result = sketch.add(foo, bar, baz);

const pruned = result.prune('bar', 'baz');
// Result will contain only the "foo" node.
```

### _subtract( sketch )_

Performs a boolean subtraction: any polyfaces in the provided sketch will be subtracted from any polyfaces in the original sketch.

```js
const result = sketch
  .rectangle([0, 0], 10, 5)
  .subtract(sketch.new.rectangle([8, 2], 5, 3));
```


### _union( sketch )_

Performs a boolean union of the provided polyfaces, and adds the resulting polyface to the sketch.

```js
const result = sketch
  .polyface([0, 0], 10, 5)
  .union(sketch.new.rectangle([8, 2], 5, 3));
```


## Transformations

### _orient( point, point, point, point )_

Orients all of the entities in a sketch by picking an origin and a direction point, and then aligning with a target origin and direction point.

```js
// origin, point, target_origin, target_point
const result = sketch.orient([0, 0], [1, 0], [5, 5], [5, 10]);
```


### _snap( segment, segment, number, boolean )_
### _snap( point, point )_

Transforms a sketch to align with the provided geometry.

```js
const geometry = sketch.rectangle([0, 0], 10, 5, 1);

const anchor = sketch.segment([0, 0], [10, -10]).edge('first');
const free = sketch.segment([0, 0], [10, 0]).edge('first');

// anchor, free, slide, flip
const snapped = sketch.snap(anchor, free, 10, false);
// snap will:
//  1) snap them together at their start point
//  2) rotate them into alignment
//  3) offset along the anchor edge by the amount specified in the slide parameter


// anchor, free
const translated = sketch.snap([10, 5], [0, 0]);
// snap will translate the sketch so that the 'free' point is aligned with the 'anchor' point

```


### _rotate( number[, string] )_

Rotates all of the entities in a sketch by a provided angle. The default units are degrees, pass "rad" to the optional second argument to use radians.

```js
const a = sketch.rotate(45);

const b = sketch.rotate(Math.PI / 4, "rad");
```


### _scale( number, number )_

Scales all of the entities in a sketch by the provided x- and y- values. NOTE: this will not correctly perform non-uniform scaling of arcs (i.e., by turning them into ellipses).

```js
const result = sketch.scale(4, 4);
```


### _translate( number, number )_

Translates all of the entities in a sketch by the provided x- and y- values.

```js
const result = sketch.translate(25, -5);
```


## Style features

### _fill( string )_

Applies the given fill color to all entities in a sketch.

```js
const result = sketch.fill("green");
```


### _hatch( string[, number[, number[, string[, string] ] ] ] )_

Applies the indicated hatch pattern to all polyfaces in a sketch.

Valid values for the "pattern" argument:
  - `crosshatch`
  - `lines`
  - `steel`
  - `concrete`

```js
// pattern, scale = 1, angle = 0, color = 'black', background = 'white'
const a = sketch.hatch('concrete', 0.5, 45, 'red', 'none');

const b = sketch.hatch('crosshatch');
```


### _linestyle( number[, ...number] )_

Adds a style in the provided pattern of dashes and spaces.

```js
const a = sketch.linestyle(15, 5, 2, 5);
```

### _stroke( string, number )_

Applies the given color and line thickness property to all entities in a sketch.

```js
const result = sketch.stroke("red", 3);
// Results in a red stroke of thickness 3.
```

### _style( string )_

Any named styles that are defined in the [index.json](files.md) can be applied to the node.

```js
const result = sketch.style('foo');
```

## Meta features

### _hide()_

Hides a given sketch node. When hidden, the sketch (and all of its children) will be invisible in any plotted output. Hidden nodes will not be returned by any of the standard [getters](#sketch-getters) or [queries](#sketch-queries). To find hidden entities, add the prefix "hidden" to any of the getters or queries.

```js
// polycurve will not be visible if h1 is rendered
const h1 = sketch.polycurve([0, 0], 1, [5, 5]).hide();

// hidden entities can still be queried by using the "hidden" getter
const entities = sketch.hidden.entities;
```

### _name( string )_

Gives a name to a sketch node. This name can be used to label a particular sketch so that it can easily be "found" subsequently.

```js
// A sketch node is given a name
const rect = sketch.rectangle([0, 0], 10, 5, 1).name('my_rect');

// It can then be combined with other geometry
const combined = rect.circle([-10, -10], 3).point(15, -10);

// The named sketch node can then be found
const original = combined.find('my_rect');
```

### _show()_

Converts a hidden sketch to a visible sketch.

```js
const hidden = sketch.rectangle([0, 0], 10, 5, 1).hide();
// "hidden" will be invisible in rendered output

const shown = hidden.show();
// "shown" will be visible.
```

### _tag()_

Adds a tag to a node. This tag can be used in subsequent queries.

```js
const rect = sketch.rectangle([0, 0], 10, 5, 1).tag('rectangles');

const node = rect.find((s) => s.node.tags.includes('rectangles'));
```

### _z( number )_

Adds a z-index to a node, which can be supported by some renderers (like SVG).

```js
const a = sketch.new.circle([0, 0], 10).fill('red');
const b = sketch.new.circle([5, 0], 10).fill('green').z(2);
const c = sketch.new.circle([10, 0], 10).fill('blue').z(1);
const result = sketch.add(a, b, c);
```


## Sketch utility functions

### _add( ...args )_

Returns a new sketch with child sketches or entities added.

```js
const sketchC = sketch.add(sketchA, sketchB, entityA, entityB);
```


### _new_

Returns a new blank sketch with no entities or child nodes.

```js
const blank = sketch.new;
```


### _create( options )_

Creates a new blank sketch with optional properties

```js
const mySketch = sketch.create({
  entity,   // An entity associated with this node
  children, // An array of child nodes
});
```


### _clone()_

Returns a clone of a sketch

```js
const clone = sketch.clone();
```


### _shape_

Returns the first available geometric entity in a sketch

```js
const shape = sketch.shape;
```

## Sketch getters

A variety of getters are provided to retrieve entities from a sketch:

  - `sketch.entities` - returns all visible entities in a sketch
  - `sketch.entity(i)` - picks the indicated entity. Can use a numerical index, "first" or "last", or a negative index.
  - `sketch.edges` - returns all segments and arcs in a sketch
  - `sketch.edge(i)` - picks the indicated edge
  - `sketch.polyfaces` - returns all polyfaces in a sketch
  - `sketch.polycurves` - returns all polycurves in a sketch
  - `sketch.points` - returns all points in a sketch
  - `sketch.vertices` - returns all vertices in a sketch
  - `sketch.vertex(i)` - picks the indicated vertex

These getters will only return _visible_ entities--to retrieve hidden entities, the same getters can be used under the "hidden" property, i.e: `sketch.hidden.entities`, `sketch.hidden.edges`, etc.

## Sketch queries

The `sketch.find(condition)` function can be used to find a particular node in a sketch.

```js
// Finds a sketch node that has the uuid "foo", or has been given the name "foo"
const foo = sketch.find('foo')

// Finds a sketch node that has been given the name "bar"
const bar = sketch.find((s) => s.node.name === "bar")

// Finds a sketch node that was created by the "offset" feature
const baz = sketch.find((s) => s.node.feature === 'offset');
```

To find hidden nodes, use `sketch.hidden.find(condition)`.

## Entities

A sketch may contain entities of any of the following types and properties:

- `Point` - `x`, `y`
- `Segment` - `ps`, `pe`
- `Arc` - `pc`, `r`
- `Polycurve` - `vertices`
- `Polyface` - `vertices`
- `Circle` - `pc`, `r`
- `Rectangle` - `xmin`, `ymin`, `xmax`, `ymax`, `r`
- `Text` - `text`, `p`, `rotation`
- `AlignedDim` - `ps`, `pe`, `side`

## Draft

The `Draft` is a construct for organizing multiple interconnected features. On disk, it is saved as a collection of `.yaml` or `.js` feature files, as well as an `index.json` which contains metadata about the entire collection. All features within a draft can make use of other features defined within that draft. To create a new Draft object:

```js
import { Draft } from '@crhio/jsdraft';

const draft = new Draft();
```

### _Draft.load( string )_ (Node only)
### _Draft.load( object )_

In Node, a draft "file" (really a collection of files) can be imported from the file system by pointing to the containing folder.

```js
const draft = Draft.load('./path/to/folder.draft');
```

Alternatively, the `Draft.load()` function can accept an object representing the file structure, with keys as filenames and values as the contents of those files:

```js
const files = {
  'index.json': '{ "filetype": "JSDraft", "version": "0.0.1" }',
  'main.js': 'function f(s) { return s.point(0, 0) }',
};

const draft = Draft.load(files);
```

### _add_feature( string, string, string, string )_

Add a new feature to a draft collection.

```js
const file = `
parameters:
  - x: 5
sketch:
  - point: [x, 10]
`;

// name, extension, contents, type = 'sketch'
draft.add_feature('my_feature', 'yaml', file);
```

### _remove_feature( string, string )_

Removes a feature from a draft collection.

```js
// name, type = 'sketch'
draft.remove_feature('my_feature');
```

### _render( string, array, string, object )_

Renders a feature in the desired format.

```js
// name, parameters, format, options = {}
const svg = draft.render('my_feature', [2], 'svg');
```

Valid "format" options for rendering a feature: `svg`, `dxf`, `yaml`, `json`, `entities`.

See documentation for the standalone [render function](#render) for supported options.

## Render

A standalone `render` function is provided for situations where you are working directly with [Sketch](introduction.md) objects or entities and wish to render them without relying on the `Draft` construct. This function can render either Sketch objects or individual entities.


### _render( sketch, string, object )_
### _render( entity, string, object )_

```js
import { Sketch, render } from '@crhio/jsdraft';

const sketch = new Sketch()
  .polycurve([0, 0], [10, 10], [20, 0])
  .circle([20, 0], 2);

// sketch, format, options = {}
const sketchSvg = render(sketch, 'svg');
// Will result in a string of an svg file, including both the polycurve and circle defined above.

const entity = sketch.entity('first');

// entity, format, options = {}
const entitySvg = render(entity, 'svg');
// Will result in an svg string for just the polycurve.
```

Valid options for sketch svg output:

- `viewport`:
  - `"svg"` (default): svg string is enclosed in an `<svg>` tag.
  - `"g"`: svg string is enclosed in a `<g>` tag.
  - `null`: svg string is not enclosed in any tag.
  - `"js"`: a JS structure of the document is returned instead of a string

- `show`:
  - `"visible"` (default): include only elements that are not marked as "hidden"
  - `"all"`: include all elements, both hidden and visible
  - `"hidden"`: include only hidden elements
