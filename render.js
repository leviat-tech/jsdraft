#!/usr/bin/env node
const { program } = require('commander');
const Composition = require('./src/composition.js');


function main(renderer, path, args) {
  // parse parameters
  const params = args.map(a => JSON.parse(a));

  // import desired render function
  const render = require(`./src/render/${renderer}.js`);

  // import root draft function
  const draft = require(path);

  // create blank composition to pass to root draft function
  const blank = new Composition();

  // execute root draft function and render
  const composition = draft(blank, ...args);
  render(composition);
}

program
  .arguments('<renderer> <draft> [arguments...]')
  .description('renderer', {
    renderer: 'render function',
    draft: 'root draft function to generate composition',
    args: 'json arguments to pass root draft function'
  })
  .action(main);
program.parse(process.argv);
