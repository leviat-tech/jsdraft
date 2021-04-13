function parse_filename(filename) {
  const segments = filename.split('.');
  if (segments.length < 2 || !segments[0]) {
    return null;
  }

  return {
    filename,
    name: segments[0],
    type: segments[1],
    extension: segments[segments.length - 1],
  };
}

module.exports = parse_filename;
