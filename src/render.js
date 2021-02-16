#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const load = require('./loaders/load');
const Sketch = require('./sketch/sketch.js');


function main(renderer, feature, args) {
  // parse parameters
  const params = args.map(a => JSON.parse(a));

  // import desired render function
  const render = require(`./renderers/${renderer}.js`);

  // import root draft function
  const draft = load(path.join(process.cwd(), feature))

  // create blank sketch to pass to root draft function
  const blank = new Sketch();

  // execute root draft function and render
  const sketch = draft(blank, ...args);
  render(sketch);
}

program
  .arguments('<renderer> <draft> [arguments...]')
  .description('renderer', {
    renderer: 'render function',
    draft: 'root draft function to generate sketch',
    args: 'json arguments to pass root draft function'
  })
  .action(main);
program.parse(process.argv);
