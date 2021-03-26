const kebab_case = require('lodash/kebabCase');


function svg_string(name, attributes, contents) {
  const attrs = Object.entries(attributes)
    .map(([attr, value]) => `${kebab_case(attr)}="${value}"`).join(' ');
  if (contents) {
    return `<${name} ${attrs} >${contents}</${name}>`;
  }
  return `<${name} ${attrs} />`;
}

module.exports = svg_string;
