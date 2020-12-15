#!/usr/bin/env node
const { program } = require('commander');


function render(context, draft, args) {
  // parse parameters
  const params = args.map(a => JSON.parse(a));

  // import desired context
  const Context = require(`./src/${context}/context.js`);

  // import draft function
  const model = require(draft);

  // include draft function
  Context.include(model);

  // execute root draft function and render
  const c = new Context();
  c[model.name](...params).render();
}

program
  .arguments('<context> <draft> [arguments...]')
  .description('render', {
    context: 'context to render to',
    draft: 'file to render',
    args: 'json arguments to pass root draft function'
  })
  .action(render);
program.parse(process.argv);
