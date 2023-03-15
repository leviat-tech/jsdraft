# JSDraft App

The JSDraft app is primarily a viewer of sketch features, with simple functionality for:

- Editing the feature in an integrated editor
- Listing the entities returned by a feature
- Adding/removing new features to a draft file

## Launching the app

First install the app's dependencies:
```bash
npm install
npm run build
cd app
npm install
```

To run the app in a browser window:
```bash
npm run dev
```

To run the app in electron:
```bash
npm run electron-dev
```

## Creating a sketch feature

There is a file browser in the bottom-right corner of the application. Click the "+" button to add a new file. You can choose either a "yaml" or "js" extension--this will determine the syntax used to interpret the feature.

## Navigating a drawing

* The scroll wheel can be used to zoom in/out of a drawing.
* Pan the drawing by either right-dragging (while using the "select" tool) or by choosing the "pan" tool
* Click the name of a sketch in the 

## Editing the drawing

The primary means of editing the feature is through the integrated code browser: click the "</>" icon at the top toolbar to open the code pane.

For more details on the feature syntax, see:

* [JS syntax](js-syntax.md)
* [YAML syntax](yaml-syntax.md)

## Opening an existing drawing

Click the "file open" button to open an existing "file" (a folder with a .draft extension). If you are running the electron app, a file that has been opened or saved will update live if it is modified on disk. This allows you to use an external editor if you prefer to edit the sketch features.

## Saving a drawing

If you are using the electron app, clicking the "save" button will save any changes to the file on disk. If you are running the app in a browser, it will download a .zip file containing all sketch features.

## Entities list

The list of entities that are produced by the selected sketch feature are listed in the sidebar at right.