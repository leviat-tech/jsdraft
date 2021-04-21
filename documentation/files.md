# JSDraft files

JSDraft "files" are just folders containing any number of feature functions, written in either [JS](js-syntax.md) or [YAML](yaml-syntax.md) syntax. The files are uncompressed to allow for simplified editing in the user's preferred editor. The folder containing these files has a `.draft` extension. A typical `.draft` file might look like this:

```
my_drawing.draft
├── index.json
└── sketch-features/
    ├── foo.yaml
    ├── bar.js
    └── baz.yaml
```

All features in the `sketch-features` directory are automatically registered as user features, and can be used by any of the other features within the `.draft` container.

The `index.json` file stores metadata about the project.

## Importing JSDraft Files

As a `Draft` object is just a collection of files, it can be constructed by adding each file individually using [the Draft api](api.md#draft). There are also convenience functions for importing a complete `.draft` file on disk, whether in a Node.js or Webpack environment.

### Node

Use the static load function load a .draft file from a path:

```js
const { Draft } = require('@crhio/jsdraft');
const draft = Draft.load('path/to/file.draft');
```

### Webpack

Install the separate package, `@crhio/webpack-jsdraft-loader`. The webpack config should contain a rule to define importing of `.draft` files:

```js
// webpack.config.js
import draftLoader from '@crhio/webpack-jsdraft-loader';

module.exports = {
  module: {
    rules: [
      {
        test: /\.draft\/index\.json$/,
        type: 'javascript/auto',
        use: [
          { loader: draftLoader },
        ],
      }
    ]
  }
}
```

Then the standard import syntax can be used to import a draft file:

```js
import draft from 'path/to/file.draft';

const svg = draft.render('my_sketch', [1, 2, 3], 'svg');
```
