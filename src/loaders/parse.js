const javascript = require('./javascript');
const yaml = require('./yaml');


module.exports = function parse(filetype, contents, name) {
  if (filetype === 'javascript' || filetype === 'js') {
    return javascript.parse(contents, name);
  } if (filetype === 'yaml') {
    return yaml.parse(contents, name);
  }
  throw new Error(`Unable to parse feature filetype ${filetype}`);
};
