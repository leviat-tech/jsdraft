# JSDraft YAML Syntax

Features can be defined as YAML document. A YAML feature can consist of any of the following top-level features (all optional):

```yaml
---
parameters:
reference:
sketch:
```

## Parameters

The "parameters" property defines the interface for the feature function. "parameters" should be an array of properties, which will be used in the given order when calling the function.

```yaml
parameters:
  # A simple key/value can be used to define the name and default.
  # Type will be inferred from the provided default. Acceptable parameter
  # types are Number, String, Boolean, or Array. Object parameter types cannot use this
  # shorthand.
  - size: 10 

  # A bare string will result in a parameter with the provided name. The default will
  # be undefined.
  - depth

  # An object can also be provided, which will allow definition of
  # additional properties.
  - width:
      # If type is not provided, it will be inferred from the default. An explicit
      # type declaration will throw an error if the provided parameter does not
      # match the defined type.
      type: number
      default: 15

  # geometric entities can also be parameters.
  - point_a:
      # casting to an entity type will call the Point constructor on the input parameter
      cast: point
      default: [10, 15]
  
  # a shorthand can be used to cast to a type
  - point_b:point: [1, 1]
```

## Reference

The "reference" property is used to store computed properties that are used in the sketch. These can be primitive values, sketches, or geometric entities. They are evaluated in order, with each reference having access to previously defined references and parameters.

```yaml
parameters:
  - width: 5
reference:
  # Strings are evaluated as javascript expressions
  - height: width * 2

  # YAML arrays and objects can be used
  - my_arr: [1, 2, 3, height + 2]
  - my_obj:
      a: 2
      b: height / 2

  # the JS Math constants and functions are provided to the evaluation context
  - radius: sin(PI / 6)

  # Geometric entities can be created by using the "cast" shorthand
  - my_pt:point: [1, 2]
  - my_circ:circle: [[3, 3], 20]

  # Sketches are defined by using the array-to-chain convention
  - my_sketch:sketch:
      - rectangle: [my_pt, width, height]
      - circle: [my_pt, radius]
```

## Sketch

The "sketch" property accepts an array of function calls, which are chained together to produce the result which will be returned by the sketch function. So the following:

```yaml
sketch:
  - rectangle: [[0, 0], 3, 5]
  - point: [2, 2]
```

...is equivalent to the following in JavaScript:

```js
sketch
  .rectangle([0, 0], 3, 5)
  .point(2, 2);
```

The sketch property has access to all of the variables that have been defined in the "parameters" and "reference" properties. So the following would be a valid feature function:

```yaml
parameters:
  - origin:point: [0, 0]
  - width: 5
reference:
  - height: width / 2
  - angle: 45
sketch:
  # arguments are passed to the function as an array
  - rectangle: [origin, width, height]

  # a "sketch" can be nested to isolate the effects of a function (like "rotate")
  # that affect all of the entities within a sketch
  - sketch:
      - rectangle: [origin, width, height]
      - rotate: [angle]
  
  # if a function accepts only a single non-array argument, it can be passed as a value
  # instead of as an array
  - rotate: angle

  # functions that accept no arguments can be called by using a bare string
  - explode

  # ...or as an empty array.
  - join: []

  # because strings in YAML are evaluated, a string of "red" would throw an error because
  # the interpreter will attempt to evaluate the symbol "red". To pass a string literal
  # to a function, therefore, we need to provide two sets of quotes.
  - fill: '"red"'
```

Documentation of all of the built-in sketch feature functions can be found in the [api documentation](api.md#sketch-features).
