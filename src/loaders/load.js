const javascript = require('./javascript');
const yaml = require('./yaml');


module.exports = function load(name, filetype, contents) {
  if (filetype === 'js') {
    return javascript.load(name, contents);
  }

  if (filetype === 'yaml') {
    return yaml.load(name, contents);
  }

  throw new Error(`Unable to load feature function from ${filetype}`);
};
