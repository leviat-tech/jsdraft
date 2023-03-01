const yaml = require('js-yaml');
const evaluate = require('../utility/misc/evaluate.js');


// extract the key from a single label yaml object
function unwind(obj) {
  if (typeof obj === 'string') return obj;
  return Object.keys(obj)[0];
}

/*
Possible shapes for yaml parameters:
[
  'thing',
  { thing: 1 },
  { thing: { default: 1 } },
  { "thing:point": [1, 2] },
];
*/

function normalize_yaml_param(param) {
  // get parameter name
  const name = unwind(param);

  // get parameter definition
  let def = param[name];
  if (typeof def !== 'object' || Array.isArray(def)) {
    def = {
      default: def,
    };
  }

  // check whether name includes cast property
  const match = name.match(/(.+):(.+)/);
  if (match) {
    def.name = match[1];
    def.cast = match[2];
  } else {
    def.name = name;
  }

  return def;
}

/*
Possible shapes for js parameters:
[
  'thing',
  { name: 'thing', default: 1 },
];
*/

function normalize_js_param(param) {
  if (typeof param === 'string') {
    return { name: param };
  }

  return param;
}

function parameters(file) {
  if (file.extension === 'js') {
    const def = typeof file.contents === 'object' ? file.contents : evaluate(file.contents.trim());

    return def
      && def.parameters
      && def.parameters.map((p) => normalize_js_param(p));
  }

  if (file.extension === 'yaml') {
    const def = yaml.load(file.contents);

    return def
      && def.parameters
      && def.parameters.map((p) => normalize_yaml_param(p));
  }

  return undefined;
}

module.exports = { parameters, normalize_yaml_param, normalize_js_param };
