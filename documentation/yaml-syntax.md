# YAML Syntax

Design principles:
 - The YAML syntax should follow the principle of least surprise for users who are familiar with CAD paradigms (AutoCAD, Inventor, Solidworks, etc.).
 - All top-level properties are optional
 - Defaults & shorthands should make composing in less verbose versions of documents possible

## Meta

If the meta property is omitted, it will be assumed that the file is a "draft" type and the version is the latest draft syntax version.

```yaml
---
meta:
  filetype: draft
  version: 0.1.0 
```

## Parameters

The parameters property is an array of parameters which can be used in the context of feature evaluation.

```yaml
parameters:
  # A bare string will result in a parameter with the provided name. The default will
  # be undefined.
  - depth

  # A simple key/value can be used to define the name and default.
  # Type will be inferred from the provided default.
  - size: 10 

  # An object can also be provided, which will allow definition of
  # additional properties.
  - width:
      # If type is not provided, it will be inferred from the default.
      type: number # number, string, array, enum, boolean, point, curve, dimension, etc.
      default: 15
      max: 20 # additional properties can be provided for certain parameter types
      min: 5

  - pointA:
      type: point
      default: [10, 15]
```

## Features

A "feature" is the basic drawing unit. The top-level "features" property is an array; each feature can return "geometry", which will be available to subsequent features as references.

The following features are proposed as the initial set of built-in features:

Geometric features:
 - point
 - line
 - arc
 - rectangle
 - circle
 - polyline
 - path
 - plate
 - move
 - rotate
 - scale
 - orient
 - fillet
 - offset
 - mirror
 - trim
 - join
 - extend
 - split
 - select
 - hide
 - boolean union
 - boolean subtraction

These will result in the following geometric reference types:
  - point
  - curve (a polycurve of straight or arc segments)


In addition to the geometric features, there will be annotation features:

Annotations:
 - text
 - mark
 - aligned dimension
 - angle dimension
 - diameter dimension
 - dimension string

These features do not add additional geometry references.

Features can also apply style properties to the geometry that they output:
 - stroke
 - fill
 - opacity
 - stroke width
 - linetype

```yaml
features:
  # Explicit values can be defined 
  - point: [1, 1] 

  # Or references to the context
  - point: context.find('point.12345')

  # Named references can be created by wrapping a feature (or array of features) in a group
  - $my_group: # Group names are always preceded with the dollar sign
    - point: [3, 5]
  
  - point: my_group.points[0] + [5, 1]

  # Featues have a verbose syntax:
  - line:
      point_a: [1, 1]
      point_b: [5, 10]
  - arc:
      point_a: [1, 1]
      point_b: [3, 3]
      bulge: 0.5
  - path:
      commands:
        - lineto: [0, 0]
        - vlineto: width
        - hlineto: width * 2
        - vlineto: 0

  # and an abbreviated syntax:
  - line: [[1, 1], [5, 10]]
  - arc: [[1, 1], [3, 3], 0.5]
  - path:
    - lineto: [0, 0]
    - vlineto: width
    - hlineto: width * 2
    - vlineto: 0
```

## Blocks

Blocks are defined at the top draft level. They consist of an optional parameters property, and a features property, both of which have the same syntax as the top-level `features` and `parameters`. Blocks are not rendered in the plotted output unless they are instanced.

```yaml
blocks:
  my_block:
    parameters:
      - width: 5
    features:
      - rectangle: [0, 0, width, 5]
features:
  # The block is instanced like any of the built-in features. Arguments can be
  # passed to the block to flex the instance--in this case we will have a rectangle
  # of width 3 and height 5.
  - my_block: 3 # If a block has only one argument, it does not require parentheses
```

## Vars

A "var" is an expression that can be evaluated and assigned a variable name, so that it can be used in subsequent operations. It is evaluated in order like any other feature.

```yaml
parameters:
  - height: 10
features:
  # "width" in this case is undefined, and will throw an error
  - rectangle: [0, 0, width, height]

  # A var can be declared: in this case, the var will be named "width" and will be
  # the result of the expression, "height / 2"
  - var: [width, height / 2]

  # Now the var can be used
  - rectangle: [0, 0, width, height]
```

Vars in groups are namespaced.

```yaml
features:
  - $my_rect:
    - rectangle: [0, 0, 5, 10]
    - var: [area, 5 * 10]

  # Use the group name "my_rect" to access vars in that group.
  - rectangle: [0, 0, sqrt(my_rect.area), sqrt(my_rect.area)] 
```

## References

Features can contribute `curves`, `points`, or `vars` to the context that is available to subsequent features. Some features (line, rectangle, circle, arc, path, etc.) add to the curves & points that are in context. Some (ie., split, trim, offset, fillet) can remove one or more of the outputs.

A `curve` can have multiple `segments` and `vertices`.

```yaml
features:
  - $group_a:
    # returns a context with one curve
    - line: [[0, 0], [5, 5]]

    # returns a context with the original curve and a new curve
    - line: [[0, 10], [5, 5]]

    # returns a context with a single curve with two segments
    - join
  
  # returns a context with a single curve with two straight segments and an arc joining them
  - $group_b:
    - fillet: [group_a.curves[0], 1]

  # returns a new context with only one point
  - select: [group_b.curves[0].vertices[1]]
```

## Styles

Styles are applied by using any of the style features. Styles only change the graphical appearance of the in-context geometric entities--they do not add, remove, or modify any entities.

```yaml
features:
  - rectangle: [0, 0, 10, 5]

  # Question: would there ever be a need to interpret the style values? If so, then
  # perhaps they should be double-quoted here. Alternatively, we could perhaps allow
  # each feature definition to define which properties are interpreted, which might
  # mean that we could have draft documents less cluttered with double-quotes.
  - stroke: green
  - fill: blue
  - stroke_width: 2
```

## Layers

Layers are defined at the top level, and allow style and visibility properties to be defined for multiple entities at once.

The `layer` feature allows context entities be tagged by layer.

```yaml
layers:
  my_layer:
    stroke: black
    fill: green
features:
  - line: [[0, 0], [5, 5]]
  - line: [[0, 10], [5, 5]]
  - layer: my_layer
```

## Tables

Tables are also features. Once a table has been defined, data can be accessed using the "find" function.

```yaml
parameters:
  height: 160
  thickness: 80
  diameter: 6
features:
  - rectangle: [0, 0, thickness, height]
  - table:
      name: angles
      data:
        - { height: 160, thickness: 80, diameter: 6, angle: 40 }
        - { height: 160, thickness: 80, diameter: 8, angle: 35 }
        - { height: 160, thickness: 80, diameter: 10, angle: 35 }
        - { height: 160, thickness: 120, diameter: 6, angle: 35 }
        - { height: 160, thickness: 120, diameter: 8, angle: 35 }
        - { height: 160, thickness: 120, diameter: 10, angle: 35 }
        - { height: 170, thickness: 80, diameter: 6, angle: 45 }
        - { height: 170, thickness: 80, diameter: 8, angle: 40 }
        - { height: 170, thickness: 80, diameter: 10, angle: 35 }
        - { height: 170, thickness: 120, diameter: 6, angle: 35 }
        - { height: 170, thickness: 120, diameter: 8, angle: 35 }
        - { height: 170, thickness: 120, diameter: 10, angle: 35 }
  - rotate: "angles.find({ height: height, thickness: thickness, diameter: diameter }).angle"
```

## Custom features

Custom features can be written [in javascript](./js-syntax.md) and registered with Draft. They can then be used like any other feature using the standard YAML syntax.
