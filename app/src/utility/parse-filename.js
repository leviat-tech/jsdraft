function parseFilename(filename) {
  if (!filename) return null;

  const segments = filename.split('.');
  if (segments.length < 2 || !segments[0]) {
    return null;
  }

  return {
    filename,
    name: segments.slice(0, -1).join('.'),
    extension: segments[segments.length - 1],
  };
}

export default parseFilename;
