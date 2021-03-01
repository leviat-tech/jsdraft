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

async function loadFileInBrowser(e) {
  const files = Array.from(e.target.files);

  const filePromises = files
    .map((file) => ({
      name: parseFilename(file.name),
      file,
    }))
    .filter((file) => file.name)
    .map((file) => new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const fileReader = document.getElementById('fileReader');
        fileReader.value = '';

        resolve({
          ...file.name,
          contents: evt.target.result,
        });
      };

      reader.readAsText(file.file);
    }));

  const results = await Promise.all(filePromises);
  return results;
}

export default loadFileInBrowser;
