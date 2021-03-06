const yaml = require('js-yaml');


module.exports = function render(sketch) {
  return yaml.dump(sketch, null, 2);
};
