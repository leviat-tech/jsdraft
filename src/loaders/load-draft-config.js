const each = require('lodash/each');
const reduce = require('lodash/reduce');


function load_draft_config(config, Draft) {
  const draft = new Draft();
  const xrefs = {};

  if (config.xrefs) {
    each(config.xrefs, (xref, key) => {
      xrefs[key] = new Draft();

      // Catch errors so that drafts with failed xrefs can still be loaded.
      try {
       each(xref, (func, name) => {
          xrefs[key].add_feature(name, 'js', { parameters: [], func })
       });
      } catch {
        console.error(`Unable to load xref "${key}".`);
      }
    });
  }

  each(config.features, (value, key) => {
    draft.add_feature(key, 'js', value);
  });

  draft.settings = config.settings || {};
  draft.styles = config.styles || {};
  draft.xrefs = xrefs;

  return draft;
}

module.exports = load_draft_config;
