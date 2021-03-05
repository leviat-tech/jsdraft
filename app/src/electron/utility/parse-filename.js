const validFiletypes = {
  js: 'application/x-javascript',
  yaml: 'application/x-yaml',
};

function parseFilename(filename) {
  const segments = filename.split('.');
  if (segments.length !== 3
    || segments[1] !== 'sketch'
    || !validFiletypes[segments[2]]
  ) {
    return null;
  }

  return {
    filename,
    name: segments[0],
    type: segments[1],
    extension: segments[2],
  };
}

module.exports = parseFilename;
