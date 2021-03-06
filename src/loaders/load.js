const javascript = require('./javascript');
const yaml = require('./yaml');

module.exports = function load(path) {
  if (path.endsWith('js')) {
    return javascript.load(path);
  } else if (path.endsWith('yaml')) {
    return yaml.load(path)
  } else {
    throw new Error(`Unable to load feature fuction from ${path}`)
  }
}
