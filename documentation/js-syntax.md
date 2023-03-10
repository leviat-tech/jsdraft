# JS Syntax

Defining features in JavaScript offers more freedom and power than in [YAML](yaml-syntax.md), at the expense of being somewhat more verbose for certain types of features. It will perhaps be a better option for users who are already familiar with JavaScript; also, there may be fewer surprises compared to understanding all of the ways that YAML might interpret an unquoted string.

## Feature function

The simplest feature in JavaScript is simply a function. The first argument is always the sketch that the function acts on; the function should always return a new sketch:

```js
function feature(sketch) {
  return sketch.point(1, 2);
}
```

A function can accept additional arguments as well:

```js
function functionWithArgs(sketch, a, b, c) {
  return sketch
    .circle([0, 0], a)
    .circle([0, 0], b)
    .circle([0, 0], c);
}
```

Sometimes intermediate computations need to be made; any valid JavaScript is acceptable as long as the function returns a sketch.

```js
function myRectPattern(sketch, width, height, rotation) {
  const rectangles = [1, 2, 3, 4, 5]
    .map(r => {
      // The .new getter returns a new blank sketch
      return sketch.new
        .rectangle([0, 0], width, height, 1)
        .rotate(r * 10);
    });

  // The "add" method adds sketches or entities to a sketch. 
  return sketch.add(...rectangles);
}
```

## Parameters

Defining function parameters explicitly is useful for:
* Validating input parameters or coercing them into desired classes
* Letting the app UI provide parameter override inputs, which can be useful for testing the flexing behavior of a function

To do this, instead of returning a function, we return an object, which allows the definition of some additional properties:

```js
{
  // We can provide an explicit name for the feature, which will take precedent over
  // the file name if present.
  name: 'coolFeature',

  // the parameters property should be an array--it defines the properties of each
  // argument in order.
  parameters: [
    // "cast" will attempt to coerce the parameter into the given type
    { name: 'origin', cast: 'point', default: [0, 0] },

    // "type" will validate whether the parameter is the given type
    { name: 'radius', type: 'number', default: 2 },
  ]

  // "func" is the only required property for a feature
  func: function myFeature(sketch, origin, radius) {
    return sketch.polycurve(
      [origin, radius],
      [[origin.x + 10, origin.y], radius],
      [[origin.x, origin.y + 10], radius],
    );
  },
}
```
