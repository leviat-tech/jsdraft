function parseFilename(filename) {
  if (!filename) return null;

  const segments = filename.split('.');
  if (segments.length < 2
    || !segments[0]
    || !['js', 'yaml'].includes(segments[segments.length - 1])) {
    return null;
  }

  return {
    filename,
    name: segments[0],
    extension: segments[segments.length - 1],
  };
}

module.exports = parseFilename;
