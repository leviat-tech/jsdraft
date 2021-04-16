const fs = require('fs');
const path = require('path');


function load_file(file) {
  const identifier = path.basename(file, path.extname(file));
  const doc = fs.readFileSync(file, 'utf8');
  return { doc, identifier };
}

module.exports = load_file;
