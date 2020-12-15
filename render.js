#!/usr/bin/env node
import { program } from 'commander';


async function render(context, draft, args) {
  try {
    // parse parameters
    const params = args.map(a => JSON.parse(a));

    // import desired context
    const Context = (await import(`./src/${context}/context.js`)).default;

    // import draft function
    const model = (await import(draft)).default;

    // include draft function
    Context.include(model);

    // execute root draft function and render
    const c = new Context();
    c[model.name](...params).render()
  }
  catch (e) {
    console.log(e);
  }
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
