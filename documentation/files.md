# JSDraft files

JSDraft "files" are just folders containing any number of feature functions, written in either [JS](js-syntax.md) or [YAML](yaml-syntax.md) syntax. The files are uncompressed to allow for simplified editing in the user's preferred editor. The folder containing these files has a `.draft` extension. A typical `.draft` file might look like this:

```
my_drawing.draft
├── foo.sketch.yaml
├── bar.sketch.js
├── baz.sketch.yaml
└── index.js
```

All `.sketch.yaml|js` files are sketch feature functions. All of these functions are automatically registered as user features, and can be used by any of the other features within the `.draft` container.

The `index.js` file is blank, and should remain so--its only purpose is to aid in resolving the webpack import.

## Importing JSDraft Files

As a `Draft` object is just a collection of files, it can be constructed by adding each file individually using [the Draft api](api.md#draft). There are also convenience functions for importing a complete `.draft` file on disk, whether in a Node.js or Webpack environment.

### Node

Use the static load function load a .draft file from a path:

```js
const { Draft } = require('@crhio/jsdraft');
const draft = Draft.load('path/to/file.draft');
```

### Webpack

Install the separate package, `@crhio/webpack-jsdraft-loader`, and import a `.draft` file from a path:

```js
import draft from 'path/to/file.draft';

const svg = draft.render('my_sketch', [1, 2, 3], 'svg');
```
