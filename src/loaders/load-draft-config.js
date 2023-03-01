const each = require('lodash/each');
const reduce = require('lodash/reduce');


function load_draft_config(config, Draft) {
  const draft = new Draft();

  draft.settings = config.settings || {};
  draft.styles = config.styles || {};

  console.log(config.xrefs);

  if (config.xrefs) {
    draft.xrefs = reduce(config.xrefs, (xrefs, xref, key) => {
      console.log(xref, key);
      // Catch errors so that drafts with failed xrefs can still be loaded.
      try {
        xrefs[key] = reduce(xref, (currXref, func, name) => {
          console.log(currXref, func, name);
          currXref[name] = new Draft();
          return currXref;
        }, {});
      } catch {
        console.error(`Unable to load xref "${key}".`);
      }

      return xrefs;
    }, {});
  }

  console.log(draft);


  each(config.features, (value, key) => {
    draft.add_feature(key, 'js', value);
  });

  return draft;
}

module.exports = load_draft_config;
