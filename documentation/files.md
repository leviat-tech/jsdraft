# JSDraft files

## ES6 modules

As of version 0.0.48 you no longer need a loader to load draft files into your project. Files can still be defined and loaded the old way, but now you can define features as ES6 modules and import these into the draft index file. One of the biggest benefits is that you can import shared helpers/config into feature definitions.

```
my_drawing
├── index.js
├── feature1.js
├── feature2.js
```

The `index.js` file stores metadata about the project. Project-wide settings can be defined in the `index.js` - see below for the defaults. Features should be imported here and defined in the exported config. The format for [js feature files](js-syntax.md) is the same but make sure you `export default` the function/config instead of returning it

```js
import { Draft } from '@crhio/jsdraft';
import feature1 from './feature1';
import feature2 from './feature2';
import helper1 from '../helpers/helper1'
import helper2 from '../helpers/helper2'


export default Draft.load_config({
  filetype: 'JSDraft',
  version: '0.0.1',
  settings: {
    model_unit: 'mm',
    plot_size: 1000,
    plot_unit: 'mm',
    scale: 1,
    style: {
      fill: {
        color: 'white',
        opacity: 1,
        hatch: 'concrete',
        hatch_angle: 0,
        hatch_scale: 1,
        hatch_color: 'black',
        hatch_background: 'none',
        hatch_stroke_width: 1
      },
      stroke: {
        color: 'black',
        opacity: 1,
        strokewidth: 1.5,
        scaled: false
      },
      annotation: {
        color: 'black',
        h_align: 'center',
        v_align: 'middle',
        font_size: 12,
        scale: 1,
        extension: 5,
        hash_length: 5,
        offset: 50,
        text_offset: 10,
        precision: 0
      }
    },
  },
  styles: {
    foo: {
      fill: {
        color: 'red'
      }
    }
  },
  features: {
    feature1,
    feature2
  },
  xrefs: {
    foo: {
      helper1,
      helper2
    }
  }
})
```




## Legacy format via loader

JSDraft "files" are just folders containing any number of feature functions, written in either [JS](js-syntax.md) or [YAML](yaml-syntax.md) syntax. The files are uncompressed to allow for simplified editing in the user's preferred editor. The folder containing these files has a `.draft` extension. A typical `.draft` file might look like this:

```
my_drawing.draft
├── index.json
├── foo.yaml
├── bar.js
└── baz.yaml
```

All yaml and js features in the are automatically registered as user features, and can be used by any of the other features within the `.draft` container.

The `index.json` file stores metadata about the project. Project-wide settings can be defined in the `index.json`--see below for the defaults.

```json
{
  "filetype": "JSDraft",
  "version": "0.0.1",
  "settings": {
    "model_unit": "mm",
    "plot_size": 1000,
    "plot_unit": "mm",
    "scale": 1,
    "style": {
      "fill": {
        "color": "white",
        "opacity": 1,
        "hatch": "concrete",
        "hatch_angle": 0,
        "hatch_scale": 1,
        "hatch_color": "black",
        "hatch_background": "none",
        "hatch_stroke_width": 1
      },
      "stroke": {
        "color": "black",
        "opacity": 1,
        "stroke-width": 1.5,
        "scaled": false
      },
      "annotation": {
        "color": "black",
        "h_align": "center",
        "v_align": "middle",
        "font_size": 12,
        "scale": 1,
        "extension": 5,
        "hash_length": 5,
        "offset": 50,
        "text_offset": 10,
        "precision": 0
      }
    },
  },
  "styles": {
    "foo": {
      "fill": {
        "color": "red"
      }
    }
  },
  "xrefs": {
    "foo": "../foo.draft"
  }
}
```

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
