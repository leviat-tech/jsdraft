const kebab_case = require('lodash/kebabCase');


function svg_string(name, attributes) {
  const attrs = Object.entries(attributes)
    .map(([attr, value]) => `${kebab_case(attr)}="${value}"`).join(' ');
  return `<${name} ${attrs} />`;
}

module.exports = svg_string;
