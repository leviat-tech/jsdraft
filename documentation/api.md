# JSDraft API

## Sketch features

Sketch instances have a number of built-in feature functions that can be used to add or modify entities. These are categorized according to their function:

* [Geometric features](#geometric-features)
* [Annotations](#annotations)
* [Operations](#operations)
* [Transformations](#transformations)
* [Style features](#style-features)
* [Meta features](#meta-features)

## Geometric features

### point ( x, y )

Adds a point entity.

```js
const ptSketch = sketch.point(1, 2);
```

### segment ( point, point )
### segment ( segment, point )

Adds a segment to a sketch.

```js
// Construction: from two points
const ptSketch = sketch.segment(ptA, ptB);

// Construction: perpendicular to a segment
const ptSketch = sketch.segment(segment, pt);
```

### arc ( point, number, number, number[, boolean] )
### arc ( point, number, number[, boolean] )
### arc ( point, point, point )
### arc ( point, number, point )
### arc ( segment, segment, number[, boolean] )

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

### polycurve ( value, value[, value[, ...[, value]]] )
### polycurve ( [seg[, seg[, ...[, seg]]]])

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

### polyface ( value, value, value[, value[, ...[, value]]] )
### polyface ( [seg[, seg[, ...[, seg]]]] )
### polyface ( polycurve[, bulge] )

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

### rectangle ( number, number, number, number[, number] )
### rectangle ( point, number, number[, number] )
### rectangle ( point, point[, number] )
### rectangle ( segment, number[, number] )

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

### circle ( point, number )
### circle ( point, point )
### circle ( point, point, point )
### circle ( segment, segment, number )

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

### text ( string, point[, number] )

Adds a text annotation to a sketch.

```js
// Construction: text, point, rotation
const textSketch = sketch.text("Hello, world!", [0, 0], 25);
// Places the text "Hello, world!" at the sketch's origin.
```

### aligned_dim ( point, point[, string] )

Places an aligned dimension between two points.

```js
const dimSketch = sketch.aligned_dim([0, 0], [4, 3]);
// Places an aligned dimension string traveling from the origin to [4, 3],
// with a distance label of "5".

const dimSketch = sketch.aligned_dim([0, 0], [4, 3], "right");
// Places the same aligned dimension string, but offset to the opposite side
// as in the previous example.
```

## Operations

### add_face ( polyface, polyface )

Adds a new polyface to the sketch, created by adding one polyface to another. Useful for creating polyfaces with voids.

```js
const pfaceSketch = sketch.add_face(polyface, face)
```

### explode ()

Returns a new sketch with all polycurves and polyfaces converted to arcs and segments.

```js
const exploded = sketch.explode();
```

### fillet ( number, polycurve, polycurve )

Adds a new polycurve to a sketch; the polycurve is created by taking two other polycurves and joining them with an arc of the defined radius.

```js
const pcurveA = new Polycurve([0, 0], [10, 10]);
const pcurveB = new Polycurve([10, 10], [20, 20]);

const filletedSketch = sketch.fillet(2, pcurveA, pcurveB);
```

### interpolate ( polycurve, point, point, array )

Adds a new polycurve to a sketch; the polycurve is created by taking a polycurve, orienting it along the axis between two points, and connecting the endpoints of each polycurve into a single new polycurve.

```js
const pcurve = new Polycurve([-1, 0], [-1, 1], 1, [1, 1], [1, 0]);

const interpolatedSketch = sketch.interpolate(pcurve, [0, 0], [10, 10], [2, 5, 8]);
```

### join ()

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

### offset ( entity, distance )

Adds a new polycurve or polyface entity to the sketch (depending on the type of entity being offset), offset by the "distance" provided. Can also offset arcs and segments.

```js
const pcurve = new Sketch()
  .polycurve(
    [0, 0],
    1,
    [1, 1],
    -1,
    [3, 3],
  );

const result = sketch
  .offset(pcurve, 0.25);
// Results in a new sketch with the offset polycurve.
```

### subtract ( polyface, polyface )

Performs a boolean subtraction: subtracts the second polyface from the first, and adds the resulting polyface to the sketch.

```js
const polyfaceA = new Rectangle([0, 0], 10, 5);
const polyfaceB = new Rectangle([8, 2], 5, 3);

const result = sketch.subtract(polyfaceA, polyfaceB);
```

### union ( polyface, polyface )

Performs a boolean union of the provided polyfaces, and adds the resulting polyface to the sketch.

```js
const polyfaceA = new Rectangle([0, 0], 10, 5);
const polyfaceB = new Rectangle([8, 2], 5, 3);

const result = sketch.union(polyfaceA, polyfaceB);
```

## Transformations

### orient ( point, point, point, point )

Orients all of the entities in a sketch by picking an origin and a direction point, and then aligning with a target origin and direction point.

```js
// origin, point, target_origin, target_point
const result = sketch.orient([0, 0], [1, 0], [5, 5], [5, 10]);
```

### rotate ( number[, string] )

Rotates all of the entities in a sketch by a provided angle. The default units are degrees, pass "rad" to the optional second argument to use radians.

```js
const a = sketch.rotate(45);

const b = sketch.rotate(Math.PI / 4, "rad");
```

### scale ( number, number )

Scales all of the entities in a sketch by the provided x- and y- values. NOTE: this will not correctly perform non-uniform scaling of arcs (i.e., by turning them into ellipses).

```js
const result = sketch.scale(4, 4);
```

### translate ( number, number )

Translates all of the entities in a sketch by the provided x- and y- values.

```js
const result = sketch.translate(25, -5);
```

## Style features

### fill ( string )

Applies the given fill color to all entities in a sketch.

```js
const result = sketch.fill("green");
```

### stroke ( string, number )

Applies the given color and line thickness property to all entities in a sketch.

```js
const result = sketch.stroke("red", 3);
// Results in a red stroke of thickness 3.
```

## Meta features

## Sketch utility functions

### add( ...args )

Returns a new sketch with child sketches or entities added.

```js
const sketchC = sketch.add(sketchA, sketchB, entityA, entityB);
```

### new

Returns a new blank sketch with no entities or child nodes.

```js
const blank = sketch.new;
```

### create( options )

Creates a new blank sketch with optional properties

```js
const mySketch = sketch.create({
  entity,   // An entity associated with this node
  children, // An array of child nodes
});
```

### clone()

Returns a clone of a sketch

```js
const clone = sketch.clone();
```

### shape

Returns the first available geometric entity in a sketch

```js
const shape = sketch.shape;
```

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

## Render
