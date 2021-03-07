const yaml = require('js-yaml');


module.exports = function render(sketch, options) {
  return yaml.dump(sketch, null, 2);
};
