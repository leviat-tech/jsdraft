const validFiletypes = {
  js: 'application/x-javascript',
  yaml: 'application/x-yaml',
};

function parseFilename(filename) {
  const segments = filename.split('.');
  if (segments.length < 2) {
    return null;
  }

  return {
    filename,
    name: segments[0],
    extension: segments[segments.length - 1],
  };
}

module.exports = parseFilename;
