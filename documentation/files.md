# JSDraft files

JSDraft "files" are just folders containing any number of feature functions, written in either [JS](js-syntax.md) or [YAML](yaml-syntax.md) syntax. The files are uncompressed to allow for simplified editing in the user's preferred editor. The folder containing these files has a `.draft` extension. A typical `.draft` file might look like this:

```
my_drawing.draft
├── index.json
├── foo.yaml
├── bar.js
└── baz.yaml
```

All yaml and js features in the are automatically registered as user features, and can be used by any of the other features within the `.draft` container.

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
module.exports = {
  module: {
    rules: [
      {
        test: /\.draft\/index\.json$/,
        type: 'javascript/auto',
        use: [
          { loader: '@crhio/webpack-jsdraft-loader' },
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

If you are using the ESLint "import/extensions" rule, you may need to disable the requirement to include an extension on .json files:

```js
  rules: {
    'import/extensions': ['error', 'ignorePackages', { json: 'always' }],
  }
```

*NOTE*: JSDraft is not transpiled, and uses modern language features that may not be supported depending on the contect where you are using it. `vue-cli`, for instance, uses webpack 4, which may require you to transpile the jsdraft dependency:

```js
// vue.config.js
module.exports = {
  transpileDependencies: ['@crhio/jsdraft'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.draft\/index\.json$/,
          type: 'javascript/auto',
          use: [
            { loader: '@crhio/webpack-jsdraft-loader' },
          ],
        },
      ],
    },
  },
}
```

### Rollup

Install the separate package, `@crhio/rollup-plugin-jsdraft`. The rollup config shouuld include the jsdraft rollup plugin:

```js
// rollup.config.js
import JSDraftLoader from './loader.js';


export default ({
  input: 'src/index.js',
  plugins: [JSDraftLoader()],
  output: {
    format: 'esm',
  },
});
```

Then the standard import syntax can be used to import a draft file:

```js
import draft from 'path/to/file.draft';

const svg = draft.render('my_sketch', [1, 2, 3], 'svg');
```
