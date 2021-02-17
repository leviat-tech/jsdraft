#!/usr/bin/env node
const { program } = require('commander');
const path = require('path');
const load = require('./loaders/load');
const Sketch = require('./sketch/sketch.js');


function main(renderer, feature, arguments, options) {
  // parse parameters
  const params = arguments.map(a => JSON.parse(a));

  // import desired render function
  const render = require(`./renderers/${renderer}.js`);

  // import root feature function
  const func = load(path.join(process.cwd(), feature))

  // create blank sketch to pass to root feature function
  const blank = new Sketch();

  // execute root feature function and render
  const sketch = func(blank, ...arguments);
  render(sketch, options);
}

program
  .arguments('<renderer> <feature> [arguments...]')
  .description('renderer', {
    renderer: 'render function',
    feature: 'root feature function to generate sketch',
    arguments: 'json arguments to pass root feature function',
  })
  .option('-f , --file <path>', 'output file path')
  .action(main);
program.parse();
