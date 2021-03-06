const javascript = require('./javascript');
const yaml = require('./yaml');


module.exports = function load(path) {
  if (path.endsWith('js')) {
    return javascript.load(path);
  } if (path.endsWith('yaml')) {
    return yaml.load(path);
  }
  throw new Error(`Unable to load feature function from ${path}`);
};
