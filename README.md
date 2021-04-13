# JSDraft

JSDraft is a functional toolkit for drawing and flexing 2D parametric drawings.

It includes:
- A javascript library (@crhio/jsdraft) for manipulating 2D parametric drawings
- A simple editor app to assist in creating new drawings
- TODO: A webkit loader (@crhio/webpack-jsdraft-loader) for importing drawings into webkit projects
- TODO: A vite loader (@crhio/vite-jsdraft-loader) for importing drawings into vite projects


JSDraft documentation can be found below:

* [Introduction to JSDraft](documentation/introduction.md)
* [Using the JSDraft app](documentation/app.md)
* [YAML feature syntax](documentation/yaml-syntax.md)
* [JS feature syntax](documentation/js-syntax.md)
* [Draft api](documentation/api.md)
* [Importing draft files](documentation/importing.md)

## Running the app

The app can run in the browser, or as a standalone Electron app.

To run the app, begin by cloning the repository and compiling the library:
```bash
npm install
npm run build
```

Then navigate to the app directory and run the app.
```bash
cd app
npm install
npm run electron-dev
```

## Using the library

For node-based projects:
```js
const { Draft } = require('@crhio/jsdraft');
const draft = Draft.load('path/to/file.draft');

// Render an svg of a sketch
const svg = draft.render(
  'my_sketch', // the name of the sketch within the draft "file"
  [1, 2, 3],   // parameter overrides to flex the sketch
  'svg',       // the desired output format
  { },         // provide any options to affect rendering
);
```

For webkit-based projects (having installed [webpack-jsdraft-loader](documentation/importing.md)):
```js
import draft from 'path/to/file.draft';

const svg = draft.render('my_sketch', [1, 2, 3], 'svg');
```
